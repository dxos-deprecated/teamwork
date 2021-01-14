//
// Copyright 2020 DXOS.org
//

import update from 'immutability-helper';
import React, { useState } from 'react';
import useResizeAware from 'react-resize-aware';

import { makeStyles } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';

import { keyToBuffer } from '@dxos/crypto';
import { FullScreen, SVG, useGrid } from '@dxos/gem-core';
import {
  createSimulationDrag,
  Graph,
  GraphLinker,
  ForceLayout,
  LinkProjector,
  NodeProjector,
  Markers
} from '@dxos/gem-spore';
import { useItems, useParty } from '@dxos/react-client';

import { GRAPH_PAD } from './model';

export const OBJECT_ORG = 'wrn://dxos/object/org';
export const OBJECT_PERSON = 'wrn://dxos/object/person';
export const OBJECT_PROJECT = 'wrn://dxos/object/project';
export const OBJECT_TASK = 'wrn://dxos/object/task';

export const LINK_EMPLOYEE = 'wrn://dxos/link/employee';
export const LINK_PROJECT = 'wrn://dxos/link/project';
export const LINK_ASSIGNED = 'wrn://dxos/link/assigned';

const propertyAdapter = (node) => ({
  class: node.type.split('/').pop(),
  radius: {
    [OBJECT_ORG]: 16,
    [OBJECT_PROJECT]: 12,
    [OBJECT_PERSON]: 8,
    [OBJECT_TASK]: 6
  }[node.type] || 8
});

const useStyles = makeStyles(() => ({
  nodes: {
    '& g.node text': {
      fill: colors.grey[700],
      fontFamily: 'sans-serif',
      fontSize: 12
    },
    '& g.node.org circle': {
      fill: colors.blue[300],
      stroke: colors.blue[700],
      strokeWidth: 3
    },
    '& g.node.project circle': {
      fill: colors.orange[300],
      stroke: colors.orange[700],
      strokeWidth: 2
    },
    '& g.node.task circle': {
      fill: colors.pink[300],
      stroke: colors.pink[700],
      strokeWidth: 2
    },
    '& g.node.person circle': {
      fill: colors.green[300],
      stroke: colors.green[700],
      strokeWidth: 1
    }
  }
}));

export const Main = ({ itemId, topic }) => {
  const classes = useStyles();
  const party = useParty(keyToBuffer(topic));
  const [item] = useItems({ partyKey: party.key, type: GRAPH_PAD, id: itemId });

  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({ node: { showLabels: true, propertyAdapter } }));
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }));
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  if (!item) {
    return null;
  }

  const data = [];
  const onCreate = () => {};

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={size.width} height={size.height}>
        <Markers arrowSize={10}/>
        <GraphLinker
          grid={grid}
          drag={drag}
          onUpdate={mutations => onCreate((update({ nodes: [], links: [] }, mutations)))}
        />
        <Graph
          grid={grid}
          data={data}
          layout={layout}
          drag={drag}
          nodeProjector={nodeProjector}
          linkProjector={linkProjector}
          classes={{
            nodes: classes.nodes
          }}
        />
      </SVG>
    </FullScreen>
  );
};
