//
// Copyright 2019 DXOS.org
//

import { EchoModel } from '@dxos/echo-db';

export function mergeFeeds (feeds) {
  if (feeds.length === 1) {
    return feeds[0].messages;
  }

  const done = [];
  const all = [];
  feeds.forEach(feed => {
    feed.messages.forEach(msg => {
      if (!done[msg.id]) {
        done[msg.id] = true;
        all.push(msg);
      }
    });
  });

  return all;
}

function getPos (item) {
  return (item && item.position) || '';
}

/*
 * Comparison function for two positions. When both positions are equal we
 * fallback to comparing the IDs.
 */

function comparePosition (posA, posB, idA, idB) {
  const len = Math.min(posA.length, posB.length);

  let i;
  for (i = 0; i < len; i++) {
    if (posA[i] < posB[i]) {
      return -1;
    }
    if (posA[i] > posB[i]) {
      return 1;
    }
  }

  if (posA[i] === undefined && posB[i] !== undefined) {
    return -1;
  }
  if (posB[i] === undefined && posA[i] !== undefined) {
    return 1;
  }

  return idA < idB ? -1 : idA > idB ? 1 : 0;
}

function increase (pos) {
  return `${pos}1`;
}

function decrease (pos) {
  return `${pos.slice(0, pos.length - 1)}01`;
}

function positionBetween (posA, posB) {
  if (!posA.length && !posB.length) {
    return '1';
  }
  if (!posA.length) {
    return decrease(posB);
  }
  if (!posB.length) {
    return increase(posA);
  }

  let i;
  const len = Math.min(posA.length, posA.length);
  for (i = 0; i < len; i++) {
    if (posA[i] !== posB[i]) {
      break;
    }
  }

  if (!posA.slice(i).length) {
    return decrease(posB);
  }

  return increase(posA);
}

function sortByPosition (objects) {
  return objects.slice().sort((a, b) => {
    return comparePosition(
      getPos(a),
      getPos(b),
      a.id,
      b.id
    );
  });
}

/**
 * Array model on top of the echo model with the ability to address items in
 * order / by index. The local interface uses indices, which are automatically
 * translated into float-like positions relative to the item above/below in
 * order to form a proper CRDT.
 */

// TODO(burdon): Use hook -- do not extend EchoModel.
export class ArrayModel extends EchoModel {
  /**
   * Keep a cache around of all items in proper order. On update we invalidate
   * the cache and require a reorder.
   */
  _itemCache = undefined;

  _objectType;

  constructor (type) {
    super(type);
    this._objectType = type;
    this.on('update', () => this.invalidateItemCache());
  }

  invalidateItemCache () {
    this._itemCache = undefined;
  }

  getItems () {
    if (this._itemCache === undefined) {
      this._itemCache = sortByPosition(this.getObjectsByType(this._objectType));
    }
    return this._itemCache;
  }

  getByIndex (index) {
    return this.getItems()[index];
  }

  findById (objectId) {
    return this.getItems().find(item => item.id === objectId);
  }

  findIndexById (objectId) {
    return this.getItems().findIndex(item => item.id === objectId);
  }

  updateByIndex (index, properties) {
    const item = this.getByIndex(index);
    if (item) {
      this.updateItem(item.id, { ...item.properties, ...properties });
    }
  }

  insertItemAtIndex (index, properties) {
    const position = this.prepareForInsertion(index);
    return this.createItem(this._objectType, { ...properties, position });
  }

  push (properties) {
    const at = this.getItems().length;
    return this.insertItemAtIndex(at, properties);
  }

  unshift (properties) {
    return this.insertItemAtIndex(0, properties);
  }

  deleteItemByIndex (index) {
    const item = this.getByIndex(index);
    this.deleteItem(item.id);
  }

  moveItemByIndex (from, to) {
    if (from === to) {
      return;
    }

    const items = this.getItems();

    // Out of bounds.
    if (from < 0 || from > items.length - 1) {
      return;
    }
    if (to < 0 || to > items.length) {
      return;
    }

    const us = items[from];
    const atPos = this.prepareForInsertion(from < to ? to + 1 : to);
    this.updateItem(us.id, { position: atPos });
  }

  /*
   * When we want to insert an item at a certain index we need to find a
   * position that is in between the item before and item after. When both the
   * before and after have the same position (possible after merging different
   * stream branches) we need to update the positions to free up a gap for our
   * new item. This functions does exactly that.
   *
   * Returns the position at which we can now safely insert.
   */

  prepareForInsertion (index) {
    const items = this.getItems();

    const posBefore = getPos(items[index - 1]);

    // Figure out how many consecutive items have the same position.
    let i = index;
    for (; i < items.length; i++) {
      if (getPos(items[i]) !== posBefore) break;
    }

    // One by one, in reverse order, de-duplicate the positions, preserving order.
    let posAfter = getPos(items[i]);
    for (let j = i - 1; j >= index; j--) {
      posAfter = positionBetween(posBefore, posAfter);
      this.updateItem(items[j].id, { position: posAfter });
    }

    return positionBetween(posBefore, posAfter);
  }
}
