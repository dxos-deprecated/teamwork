//
// Copyright 2020 DXOS.org
//

import React, { useRef, useState, useEffect } from 'react';
import ColorHash from 'color-hash';
import { EchoModel } from '@dxos/echo-db';
import { useModel, useProfile } from '@dxos/react-client';
import { JsonTreeView } from '@dxos/react-ux';
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

  const renderCount = useRef(0);
  renderCount.current++;

  const [addPeriodically, setAddPeriodically] = useState(false);
  useEffect(() => {
    if(addPeriodically) {
      const intervalId = setInterval(() => {
        addItem(100);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [addPeriodically])

  const [selectedId, setSelectedId] = useState()
  const selectedItem = selectedId !== undefined ? items.find(i => i.id === selectedId) : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <h4>Render count: {renderCount.current}</h4>
        <h4>Object count: {items.length}</h4>
      </div>
      <div>
        <button onClick={() => addItem(1)}>Add 1</button>
        <button onClick={() => addItem(10)}>Add 10</button>
        <button onClick={() => addItem(100)}>Add 100</button>
        <label>Add 100 every second<input type="checkbox" checked={addPeriodically} onClick={() => setAddPeriodically(x => !x)}></input></label>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
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
            onClick={() => setSelectedId(item.id)}
          >{item.properties.count > 0 ? item.properties.count : ''}</div>
        ))}
      </div>
      {selectedItem && (
        <JsonTreeView
          size="small"
          depth={2}
          data={selectedItem}
        />
      )}
    </div>
  );
};
