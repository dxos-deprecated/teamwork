//
// Copyright 2020 DXOS.org
//

import ColorHash from 'color-hash';
import debug from 'debug';
import React, { useRef, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Toolbar from '@material-ui/core/Toolbar';

import { keyToBuffer } from '@dxos/crypto';
import { ObjectModel } from '@dxos/object-model';
import { useProfile, useParty, useItems } from '@dxos/react-client';
import { JsonTreeView } from '@dxos/react-ux';

import { TYPE_TESTING_ITEM } from './model';

const colorHash = new ColorHash({ saturation: 1 });

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  expand: {
    flex: 1
  },
  data: {
    '& span': {
      marginLeft: 8
    }
  },
  cells: {
    margin: theme.spacing(1),
    overflowY: 'auto',
    flex: 1
  },
  cell: {
    display: 'inline-block',
    width: 15,
    height: 15,
    margin: 1
  }
}));

export const Main = ({ item, topic }) => {
  const party = useParty(keyToBuffer(topic));
  const classes = useStyles();

  const createItem = async (properties) => {
    const itemId = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_TESTING_ITEM,
      parrent: item.id,
      parent: item.id,
      props: { properties }
    });
    console.log('created:', itemId);
  };
  // const objects = item.children;

  const items = useItems({ partyKey: keyToBuffer(topic) })
  const objects = items.filter(o => o.parent?.id === item.id || o.parrent?.id === item.id);

  // const { objects, createItem } =
  // const objects -=
  const { publicKey } = useProfile();

  async function addItem (count) {
    for (let i = 0; i < count; i++) {
      console.log('createing an item')
      createItem({ addedBy: publicKey, count: 0 });
    }
  }

  const renderCount = useRef(0);
  renderCount.current++;

  // const [addPeriodically, setAddPeriodically] = useState(false);
  // useEffect(() => {
  //   if (addPeriodically) {
  //     const intervalId = setInterval(() => {
  //       addItem(100);
  //     }, 1000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [addPeriodically]);

  const [selectedId, setSelectedId] = useState();
  const selectedItem = selectedId !== undefined ? objects.find(i => i.id === selectedId) : undefined;

  const data = {
    render: renderCount.current,
    objects: objects.length
  };

  return (
    <div className={classes.root}>
      <Toolbar variant="dense">
        <Button color="primary" onClick={() => addItem(1)}>+1</Button>
        <Button color="primary" onClick={() => addItem(10)}>+10</Button>
        <Button color="primary" onClick={() => addItem(100)}>+100</Button>

        {/* <FormControlLabel
          className={classes.label}
          control={
            <Checkbox
              checked={addPeriodically}
              onClick={() => setAddPeriodically(running => !running)}
            />
          }
          label="Running"
        /> */}

        <div className={classes.expand} />
        <div className={classes.data}>
          {Object.keys(data).map(key => <span key={key}>{key}: {data[key]}</span>)}
        </div>
      </Toolbar>

      <div className={classes.cells}>
        {objects.map(item => (
          <div
            key={item.id}
            className={classes.cell}
            style={{
              backgroundColor: colorHash.hex(item?.properties?.addedBy?.toString('hex'))
            }}
            onClick={() => setSelectedId(item.id)}
          >{item?.properties?.count > 0 ? item?.properties?.count : ''}</div>
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
