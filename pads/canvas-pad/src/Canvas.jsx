//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { Canvas as GemCanvas } from '@dxos/gem-canvas';
import { ObjectModel } from '@dxos/object-model';
import { useParty } from '@dxos/react-client';

import { CANVAS_TYPE_OBJECT, useCanvasModel } from './model';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1
  },
  embeddedRoot: {
    minHeight: 450
  }
}));

export const Canvas = ({ topic, itemId, embedded }) => {
  assert(topic);
  assert(itemId);
  const party = useParty(keyToBuffer(topic));

  const classes = useStyles();

  const canvasObjects = useCanvasModel(topic, itemId);

  if (!canvasObjects) {
    return null;
  }

  // TODO(burdon): Bug: create object, move it, then when revisit document it's in the original position...
  // Since the messages are out of order.
  // TODO(burdon): Hack to ensure objects are well formed (if messages processed out of order).

  // const objects = canvas.model.objects.filter(o => !!(o.properties.type && o.properties.bounds));

  const objects = canvasObjects.map(canvasObject => ({
    id: canvasObject.id,
    properties: { // TODO(rzadp): Missing model API: getAllProperties.
      type: canvasObject.model.getProperty('type'),
      bounds: canvasObject.model.getProperty('bounds'),
      style: canvasObject.model.getProperty('style'),
      text: canvasObject.model.getProperty('text')
    }
  }));

  const model = {
    createObject: async (properties) => {
      await party.database.createItem({
        model: ObjectModel,
        type: CANVAS_TYPE_OBJECT,
        props: properties,
        parent: itemId
      });
    },
    updateObject: (id, properties) => {
      console.log('UpdateObject', {properties})
      const updatedObject = canvasObjects.find(canvasObject => canvasObject.id === id);
      if (!updatedObject) {
        console.warn(`Could not find object with id '${id}' to update.`);
        return;
      }
      Object.keys(properties).forEach(propertyKey => {
        updatedObject.model.setProperty(propertyKey, properties[propertyKey]);
      });
    }
  };

  return (
    <div className={clsx(classes.root, embedded ? classes.embeddedRoot : '')}>
      <GemCanvas objects={objects} model={model} />
    </div>
  );
};
