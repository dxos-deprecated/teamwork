//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Canvas as GemCanvas } from '@dxos/gem-canvas';

import { useDocument } from './model';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1
  }
}));

export const Canvas = ({ topic, itemId }) => {
  assert(topic);
  assert(itemId);

  const classes = useStyles();

  const model = useDocument(topic, itemId);

  // TODO(burdon): Bug: create object, move it, then when revisit document it's in the original position...
  // Since the messages are out of order.
  // TODO(burdon): Hack to ensure objects are well formed (if messages processed out of order).
  const objects = model.objects.filter(o => !!(o.properties.type && o.properties.bounds));

  return (
    <div className={classes.root}>
      <GemCanvas objects={objects} model={model} />
    </div>
  );
};
