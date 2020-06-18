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
import { View } from '@dxos/echo-db';

import { Pad } from '../common';

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
  views: View[],
  createView: (type: string, title: string) => void
}

export const PartyPad = ({ pad, topic, views, createView }: PartyPadProps) => {
  const router = useAppRouter();
  const classes = useStyles();

  const onSelect = (item: View) => {
    router.push({ topic, item: item.viewId });
  };

  const handleCreate = () => {
    const viewId = createView(pad.type, `item-${chance.word()}`);
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
        {views.map(item => (
          <ListItem key={item.viewId} button onClick={() => onSelect(item)}>{item.title}</ListItem>
        ))}
      </List>
      <CardActions>
        <Button size="small" color="primary" onClick={handleCreate}>{`new ${pad.displayName}`}</Button>
      </CardActions>
    </Card>
  );
};
