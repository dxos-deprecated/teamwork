//
// Copyright 2020 DXOS.org
//

import React, { useRef } from 'react';
import ColorHash from 'color-hash';
import { EchoModel } from '@dxos/echo-db';
import { useModel, useProfile } from '@dxos/react-client';
import { TYPE_TESTING_ITEM } from './model';

const colorHash = new ColorHash({ saturation: 1 });

export const Main = ({ viewId, topic }) => {
  /**
   * @type {EchoModel}
   */
  const model = useModel({ model: EchoModel, options: { type: TYPE_TESTING_ITEM, topic, viewId } });
  const items = model?.getObjectsByType(TYPE_TESTING_ITEM) ?? [];

  const { publicKey } = useProfile();

  function addItem (count) {
    for (let i = 0; i < count; i++) {
      model.createItem(TYPE_TESTING_ITEM, { addedBy: publicKey, count: 0 });
    }
  }

  function incrementItem (item) {
    model.updateItem(item.id, { count: item.properties.count + 1 });
  }

  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <h1>Render count: {renderCount.current}</h1>
      <div>
        <button onClick={() => addItem(1)}>Add 1</button>
        <button onClick={() => addItem(10)}>Add 10</button>
        <button onClick={() => addItem(100)}>Add 100</button>
      </div>
      <div>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              width: 15,
              height: 15,
              margin: 1,
              display: 'inline-block',
              backgroundColor: colorHash.hex(item.properties.addedBy?.toString('hex'))
            }}
            onClick={() => incrementItem(item)}
          >{item.properties.count > 0 ? item.properties.count : ''}</div>
        ))}
      </div>
    </div>
  );
};
