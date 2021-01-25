//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import clsx from 'clsx';
import React, { useState } from 'react';

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

export interface CanvasProps {
  topic: string,
  embedded?: boolean,
  itemId: string
}

export const Canvas = ({ topic, itemId, embedded }: CanvasProps) => {
  assert(topic);
  assert(itemId);
  const [transaction, setTransaction] = useState<Record<string, any>[] | undefined>(undefined);
  const party = useParty(keyToBuffer(topic));

  const classes = useStyles();

  const canvasObjects = useCanvasModel(topic, itemId);

  if (!canvasObjects || !party) {
    return null;
  }

  // TODO(burdon): Bug: create object, move it, then when revisit document it's in the original position...

  const objects = canvasObjects
    .filter(obj => !obj.model.getProperty('deleted'))
    .map(canvasObject => ({
      id: canvasObject.id,
      properties: {
        ...canvasObject.model.toObject()
      }
    }));

  const updateObject = async (id: string, properties: Record<string, any>) => {
    if (transaction !== undefined) {
      setTransaction(old => [...(old ?? []), { id, properties }]);
    }
    const updatedObject = canvasObjects.find(canvasObject => canvasObject.id === id);
    if (!updatedObject) {
      console.warn(`Could not find object with id '${id}' to update.`);
      return;
    }
    for (const propertyKey of Object.keys(properties)) {
      await updatedObject.model.setProperty(propertyKey, properties[propertyKey]);
    }
  };

  const model = {
    begin: () => {},
    commit: async () => {},
    createObject: async (properties: Record<string, any>) => {
      // This gets rid of any 'undefined' properties, which case object creation to fail.
      const props = Object.keys(properties).reduce<Record<string, any>>(
        (prev, curr) => {
          if (properties[curr] !== undefined) {
            prev[curr] = properties[curr];
          }
          return prev;
        },
        {});

      const maxOrder = [...new Set(objects.map(obj => obj.properties.order ?? 1))].sort()[0] ?? 1;

      await party.database.createItem({
        model: ObjectModel as any,
        type: CANVAS_TYPE_OBJECT,
        props: {
          ...props,
          order: maxOrder + 1
        },
        parent: itemId
      });
    },
    updateObject,
    deleteObject: (id: string) => updateObject(id, { deleted: true })
  };

  return (
    <div className={clsx(classes.root, embedded ? classes.embeddedRoot : '')}>
      <GemCanvas objects={objects} model={model} />
    </div>
  );
};
