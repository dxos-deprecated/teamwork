//
// Copyright 2019 DXOS.org
//

import seedrandom from 'seedrandom';

import { ArrayModel, mergeFeeds } from './array';

/*
 * We use a deterministic RNG seeded with a random number. Once we notice a
 * failure we can reuse the seed to replay the run and figure out what went
 * wrong.
 */

const SEED = 1;
// eslint-disable-next-line new-cap
const RNG = new seedrandom(SEED);

const TYPE = 'dxos.teamwork.planner.array';

/*
 * Mock ID provider making sure we generate IDs deterministically. We need this
 * to ensure that position collisions (which might happen when merging
 * streams) are handled in a predictable way so we can deterministically test
 * the expected result.
 */

let nextId = 0;
function mockIdProvider () {
  return `${TYPE}/X/${nextId++}`;
}

// Helper to create range of numbers.
function range (from, to, step = 1, inclusive = false) {
  const out = [];
  let i = from;
  for (; i < to; i += step) out.push(i);
  if (inclusive) out.push(i);
  return out;
}

function checkItems (models, expected, isEqual) {
  models.forEach(model => {
    const recon = model
      .getItems()
      .map(item => item.caption)
      .join('|');

    // Test if list reconstruction matches our expectation.
    isEqual(recon, expected);
  });
}

function setupSwarm (nrOfFeeds, nrOfClientsPerFeed, branchOf = []) {
  const feeds = [];

  const messages = mergeFeeds(branchOf);

  // When we receive a message on our mock feed we forward it to all the associated clients.
  const onMessage = feed => msg => {
    feed.messages.push(msg);
    range(0, nrOfClientsPerFeed).forEach(i => {
      feed.models[i].onUpdate([msg]);
      feed.models[i].emit('update', feed.models[i]);
    });
  };

  // Create a bunch of feeds and a bunch of clients per feed.
  range(0, nrOfFeeds).forEach(f => {
    const feed = { id: `feed${f}`, messages: messages.slice(), models: [] };
    feeds.push(feed);

    range(0, nrOfClientsPerFeed).forEach(() => {
      const model = new ArrayModel(TYPE);
      model._idProvider = mockIdProvider;

      messages.forEach(msg => {
        model.onUpdate([msg]);
        model.emit('update', model);
      });
      feed.models.push(model);
      model.on('append', onMessage(feed));
    });
  });

  return feeds;
}

/*
 * Simple immutable array item move function. Used as a reference for testing
 * the move actions we encode using messages in our CRDT have the right effect.
 */

export function arrayMove (xs, src, dest) {
  // Out of bounds
  if (dest < 0 || dest > xs.length || src < 0 || src > xs.length - 1) {
    return xs;
  }

  if (src < dest) {
    const a = xs.slice(0, src);
    const b = xs.slice(src + 1, dest + 1);
    const c = xs.slice(dest + 1);
    return [...a, ...b, xs[src], ...c];
  }

  if (dest < src) {
    const a = xs.slice(0, dest);
    const b = xs.slice(dest, src);
    const c = xs.slice(src + 1);
    return [...a, xs[src], ...b, ...c];
  }

  return xs.slice();
}

// Track global move iteration, for easier debugging of failures.
let IT = 0;

function moveItem (models, ix, from, to, isEqual) {
  const model = models[ix];
  const before = model.getItems();

  // Expected output list given a normal array move.
  const expectedItems = arrayMove(before, from, to);
  const expected = expectedItems.map(obj => obj.caption).join('|');

  // Perform message based move.
  model.moveItemByIndex(from, to);

  // Dump a lot of info on failure.
  if (
    model
      .getItems()
      .map(item => item.caption)
      .join('|') !== expected
  ) {
    console.log('seed:', SEED);
    console.log('it', IT);
    console.log('move from', from, 'to', to);
    ArrayModel.debug('before', before, a => a.caption);
    ArrayModel.debug('after', model.getItems(), a => a.caption);
    ArrayModel.debug('expected', expectedItems, a => a.caption);
  }

  checkItems(models, expected, isEqual);
  IT++;
}

// Perform a bunch of random item moves and test every step.

function randomMoves (models, count, isEqual) {
  const items = models[0].getItems();

  for (let i = 0; i < count; i++) {
    const from = Math.floor(RNG() * items.length);
    const to = Math.floor(RNG() * items.length);
    moveItem(models, i % models.length, from, to, isEqual);
  }
}

/**
 * Exported test cases. We define these here as standalone functions so we can
 * easily run and debug them from the browser.
 */

export function testArrayMain (isEqual) {
  nextId = 0;

  // Create two separate mock message feeds with two clients each.
  const startup = setupSwarm(1, 4);
  const trunk = startup[0].models;

  // Naively create a bunch of array items by using push and unshift.
  trunk[0].push({ caption: 'first' });
  trunk[1].push({ caption: 'second' });
  trunk[2].push({ caption: 'third' });
  trunk[3].push({ caption: 'fourth' });

  // Test the result of a bunch of append insertions.
  checkItems(trunk, 'first|second|third|fourth', isEqual);

  trunk[0].unshift({ caption: 'zero' });
  trunk[1].unshift({ caption: 'minusone' });

  // Test the result of a bunch of prepend insertions.
  checkItems(trunk, 'minusone|zero|first|second|third|fourth', isEqual);

  // Perform some random movements.
  moveItem(trunk, 2, 0, 5, isEqual);
  moveItem(trunk, 3, 4, 1, isEqual);
  moveItem(trunk, 2, 3, 4, isEqual);
  moveItem(trunk, 1, 2, 1, isEqual);
  moveItem(trunk, 0, 1, 5, isEqual);

  checkItems(trunk, 'zero|fourth|third|second|minusone|first', isEqual);

  // Create two 'offline' branches starting with the existing feed.
  const branched = setupSwarm(3, 2, startup);
  const branchA = branched[0].models;
  const branchB = branched[1].models;
  const branchC = branched[2].models;

  // CHeck if the branches are identical to their trunk.
  checkItems(branchA, 'zero|fourth|third|second|minusone|first', isEqual);
  checkItems(branchB, 'zero|fourth|third|second|minusone|first', isEqual);
  checkItems(branchC, 'zero|fourth|third|second|minusone|first', isEqual);

  // Bunch of additions and modifications to branch A.
  branchA[0].insertItemAtIndex(2, { caption: 'lorem' });
  branchA[1].insertItemAtIndex(4, { caption: 'ipsum' });
  branchA[0].updateByIndex(5, { caption: 'SECOND' });
  moveItem(branchA, 0, 3, 0, isEqual);

  // Bunch of additions and modifications to branch B.
  branchB[0].insertItemAtIndex(3, { caption: 'dolor' });
  branchB[1].insertItemAtIndex(0, { caption: 'sit' });
  branchB[1].insertItemAtIndex(3, { caption: 'amet' });
  branchB[1].updateByIndex(1, { caption: 'ZERO' });
  moveItem(branchB, 0, 0, 8, isEqual);

  // Bunch of additions and modifications to branch C.
  branchC[0].insertItemAtIndex(1, { caption: 'chicken' });
  branchC[1].insertItemAtIndex(2, { caption: 'monkey' });
  branchC[0].insertItemAtIndex(5, { caption: 'pig' });
  branchC[1].updateByIndex(3, { caption: 'FOURTH' });

  // Check both branches.
  checkItems(branchA, 'third|zero|fourth|lorem|ipsum|SECOND|minusone|first', isEqual);
  checkItems(branchB, 'ZERO|fourth|amet|third|dolor|second|minusone|first|sit', isEqual);
  checkItems(branchC, 'zero|chicken|monkey|FOURTH|third|pig|second|minusone|first', isEqual);

  // Merge both branches into one mainline again.
  const merged = setupSwarm(1, 2, branched)[0].models;

  checkItems(
    merged,
    'third|ZERO|chicken|monkey|FOURTH|amet|lorem|pig|ipsum|dolor|SECOND|minusone|first|sit',
    isEqual
  );

  // A bunch of random moves, checking consistency along the way.
  randomMoves(merged, 200, isEqual);
}
