//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import update from 'immutability-helper';
import times from 'lodash/times';
import React, { useEffect, useRef, useState } from 'react';
import useResizeAware from 'react-resize-aware';

import { makeStyles } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';

import { keyToBuffer } from '@dxos/crypto';
import { createTestInstance, Database, Selection } from '@dxos/echo-db';
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
import { ObjectModel } from '@dxos/object-model';
import { useItems, useParty } from '@dxos/react-client';

import ItemList from './ItemList';
import { GRAPH_PAD } from './model';

export const OBJECT_ORG = 'wrn://dxos/object/org';
export const OBJECT_PERSON = 'wrn://dxos/object/person';
export const OBJECT_PROJECT = 'wrn://dxos/object/project';
export const OBJECT_TASK = 'wrn://dxos/object/task';

export const LINK_EMPLOYEE = 'wrn://dxos/link/employee';
export const LINK_PROJECT = 'wrn://dxos/link/project';
export const LINK_ASSIGNED = 'wrn://dxos/link/assigned';

const useMutator = (database) => {
  const ref = useRef(database);
  useEffect(() => {
    ref.current = database;
  }, [database]);

  // TODO(burdon): Parameterize.
  const createItem = async (sourceId) => {
    const source = ref.current.getItem(sourceId);
    if (source.type === OBJECT_ORG) {
      const name = faker.name.firstName();
      const target = await ref.current.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } });
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target });
    }
  };

  const linkItem = async (sourceId, targetId) => {
    const source = ref.current.getItem(sourceId);
    const target = ref.current.getItem(targetId);
    if (source.type === OBJECT_ORG && target.type === OBJECT_PERSON) {
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target });
    }
  };

  return {
    createItem,
    linkItem
  };
};

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
  },
  items: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'scroll',

    color: colors.grey[700],
    '& .org': {
      color: colors.blue[700]
    },
    '& .project': {
      color: colors.orange[700]
    },
    '& .task': {
      color: colors.pink[700]
    },
    '& .person': {
      color: colors.green[700]
    }
  },
  info: {
    position: 'absolute',
    zIndex: 1,
    right: 16,
    fontFamily: 'monospace',
    color: colors.grey[700]
  }
}));

export function useSelection<T> (
  selection: Selection<any> | undefined,
  selector: (selection: Selection<any>) => T,
  deps: readonly any[] = []
): T {
  const [data, setData] = useState(() => selection && selector(selection));

  // Subscribe to mutation events from source.
  useEffect(() => {
    return selection && selection.update.on(() => {
      setData(selector(selection));
    });
  }, [selection]);

  // Update data when deps change.
  useEffect(() => {
    selection && setData(selector(selection));
  }, deps);

  return data as any;
}

const generate = async (database, config) => {
  // Orgs.
  const organizations = await Promise.all(times(config.numOrgs, () => faker.company.companyName()).map(name =>
    database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name } })
  ));

  // People.
  const people = await Promise.all(times(config.numPeople, () => faker.name.firstName()).map(async name => {
    const person = await database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } });
    const count = faker.random.number({ min: 0, max: 2 });
    const orgs = faker.random.arrayElements(organizations, count);
    return orgs.map(org => database.createLink({ type: LINK_EMPLOYEE, source: org, target: person }));
  }));

  // Projects.
  await Promise.all(times(config.numProjects, () => faker.commerce.productName()).map(async name => {
    const project = await database.createItem({ model: ObjectModel, type: OBJECT_PROJECT, props: { name } });
    const org = faker.random.arrayElement(organizations);
    await database.createLink({ type: LINK_PROJECT, source: org, target: project });

    // Task child nodes.
    // TODO(burdon): Assign to people (query people from org).
    await Promise.all(times(faker.random.number({ min: 0, max: 3 }), () => faker.git.commitMessage())
      .map(async name => {
        await database.createItem({ model: ObjectModel, type: OBJECT_TASK, props: { name }, parent: project.id });
      }));
  }));
};

export const itemSelector = selection => {
  return selection.items;
};

export const graphSelector = selection => {
  const nodes: any[] = [];
  const links: any[] = [];

  selection
    .filter({ type: OBJECT_ORG })
    .each((item: any) => nodes.push({ id: item.id, type: OBJECT_ORG, title: item.model.getProperty('name') }))
    .call(selection => {
      selection.links({ type: LINK_PROJECT })
        .each(link => {
          nodes.push({ id: link.target.id, type: OBJECT_PROJECT, title: link.target.model.getProperty('name') });
          links.push({ id: link.id, source: link.source.id, target: link.target.id });
        })
        .target()
        .children()
        .each(item => {
          nodes.push({ id: item.id, type: OBJECT_TASK, title: item.model.getProperty('name') });
          links.push({ id: `${item.parent.id}-${item.id}`, source: item.parent.id, target: item.id });
        });
    })
    .links({ type: LINK_EMPLOYEE })
    .each((link: any) => links.push({ id: link.id, source: link.source.id, target: link.target.id }))
    .target()
    .each((item: any) => nodes.push({ id: item.id, type: OBJECT_PERSON, title: item.model.getProperty('name') } as any));

  return { nodes, links };
};

export const Main = ({ itemId, topic }) => {
  const classes = useStyles();
  const party = useParty(keyToBuffer(topic));
  if (!party) {
    throw new Error('Pad used outside of party context')
  }
  const [item] = useItems({ partyKey: party.key, type: GRAPH_PAD, id: itemId } as any);

  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({ node: { showLabels: true, propertyAdapter } }));
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }));
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  const [database, setDatabase] = useState<Database | undefined>();
  const data = useSelection(database && database.select(), graphSelector);
  const items = useSelection(database && database.select(), itemSelector);
  const mutator = useMutator(database);

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();
      await generate(party.database, {
        numOrgs: 4,
        numPeople: 16,
        numProjects: 6
      });

      // TODO(burdon): ItemList doesn't update if this call is moved ahead of generate.
      setDatabase(party.database);
    });
  }, []);

  const handleCreate = data => {
    if (data.nodes.length) {
      const { source } = data.links[0];
      mutator.createItem(source);
    } else {
      const { source, target } = data.links[0];
      mutator.linkItem(source, target);
    }
  };

  if (!item) {
    return null;
  }

  return (
    <>
      <div className={classes.items}>
        <ItemList items={items} />
      </div>

      <div className={classes.info}>
        <div>Command-drag: Org &#x2192; Person</div>
      </div>
      <FullScreen>
        {resizeListener}
        <SVG width={size.width} height={size.height}>
          <Markers arrowSize={10}/>
          <GraphLinker
            grid={grid}
            drag={drag}
            onUpdate={mutations => handleCreate((update({ nodes: [], links: [] }, mutations)))}
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
    </>
  );
};
