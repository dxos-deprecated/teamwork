//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

import { useAppRouter } from '@dxos/react-appkit';
import { Pad } from '../common';
import { Item, useItemList } from '../model';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 300,
    width: 250,
  },
  list: {
    flex: 1,
  }
})

export interface PartyPadProps {
  topic: string,
  pad: Pad,
}

export const PartyPad = ({ pad, topic }: PartyPadProps) => {
  const router = useAppRouter();
  const { items } = useItemList(topic, [pad.type]);

  const classes = useStyles();

  const onSelect = (item: Item) => {
    router.push({ topic, item: item.itemId ?? (item as any).objectId });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar><pad.icon /></Avatar>}
        title={pad.displayName}
        subheader={pad.type}
      />
      <List className={classes.list}>
        {items.map(item => (
          <ListItem button onClick={() => onSelect(item)}>{item.title}</ListItem>
        ))}
      </List>
      <CardActions>
        <Button size="small" color="primary">new item</Button>
      </CardActions>
    </Card>
  );
};
