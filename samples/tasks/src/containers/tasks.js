//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Chance from 'chance';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';

import { ObjectModel } from '@dxos/echo-db';
import { humanize } from '@dxos/crypto';
import { EditableText } from '@dxos/react-ux';
import { useModel } from '@dxos/react-client';

import Header from '../components/Header';

const chance = new Chance();
const TYPE_TASK = 'tutorial.tasks';

const Tasks = () => {
  const history = useHistory();
  const { topic } = useParams();
  const model = useModel({ model: ObjectModel, options: { type: TYPE_TASK, topic } });
  const items = model?.getObjectsByType(TYPE_TASK) ?? [];

  const onCreate = () => {
    model.createItem(TYPE_TASK, { title: chance.sentence({ words: 3 }) });
  };

  const onUpdate = (id, updatedProperties) => {
    model.updateItem(id, updatedProperties);
  };

  const onDelete = (id) => {
    model.updateItem(id, { deleted: true });
  };

  return (
    <div>
      <Header
        onHome={() => history.push('/')}
        onAdd={onCreate}
      >
        {topic && humanize(topic)}
      </Header>

      <Paper>
        <List dense>
          {items.filter(item => !item.properties.deleted).map(item => (
            <ListItem
              key={item.id}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  disableRipple
                  checked={!!item.properties.checked}
                  onChange={() => onUpdate(item.id, { checked: !item.properties.checked })}
                />
              </ListItemIcon>

              <EditableText value={item.properties.title} onUpdate={title => onUpdate(item.id, { title })} />

              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Tasks;
