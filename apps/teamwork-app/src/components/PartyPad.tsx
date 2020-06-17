//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { Chance } from 'chance';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { useAppRouter } from '@dxos/react-appkit';

import { Pad } from '../common';
import { Item } from '../model';

const chance = new Chance();

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 300,
    width: 250
  },
  list: {
    flex: 1,
    overflowY: 'scroll'
  }
});

export interface PartyPadProps {
  topic: string,
  pad: Pad,
  items: Item[],
  createItem: (type: string, title: string, opts?: {}) => any
}

export const PartyPad = ({ pad, topic, items, createItem }: PartyPadProps) => {
  const router = useAppRouter();
  const classes = useStyles();

  const onSelect = (item: Item) => {
    router.push({ topic, item: item.viewId });
  };

  const handleCreate = () => {
    const title = `item-${chance.word()}`;
    const viewId = createItem(pad.type, title, { mutations: [] });
    router.push({ topic, item: viewId });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar><pad.icon /></Avatar>}
        title={pad.displayName}
        subheader={pad.description ?? ''}
      />
      <List className={classes.list}>
        {items.map(item => (
          <ListItem key={item.viewId} button onClick={() => onSelect(item)}>{item.title}</ListItem>
        ))}
      </List>
      <CardActions>
        <Button size="small" color="primary" onClick={handleCreate}>{`new ${pad.displayName}`}</Button>
      </CardActions>
    </Card>
  );
};
