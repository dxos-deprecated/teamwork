//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import compose from 'lodash.flowright';
import Chance from 'chance';

import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';

import { humanize } from '@dxos/crypto';
import { EchoModel } from '@dxos/echodb';
import { withModel } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import Header from '../components/Header';

const chance = new Chance();

const ListComponent = ({ items, onCreate, onUpdate, onDelete }) => {
  const history = useHistory();
  const { topic } = useParams();

  // Create item.
  const handleCreateItem = () => {
    onCreate({
      title: chance.sentence({ words: 3 })
    });
  };

  // Show items.
  // TODO(burdon): On create show temp edit row at bottom.
  return (
    <div>
      <Header
        onHome={() => history.push('/')}
        onAdd={handleCreateItem}
      >
        {topic && humanize(topic)}
      </Header>

      <Paper>
        <List dense>
          {items.map(({ id, checked = false, title }) => (
            <ListItem
              key={id}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  disableRipple
                  checked={checked}
                  onChange={() => onUpdate(id, { checked: !checked })}
                />
              </ListItemIcon>

              <EditableText value={title} onUpdate={title => onUpdate(id, { title })} />

              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(id)}>
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

export default compose(
  withModel({
    model: EchoModel,

    // Construct query.
    options: ({ type = 'testing.item.Item' }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { topic } = useParams(); // TODO: Incorrect hooks usage

      return {
        topic,
        type
      };
    },

    // Data and mutation handlers.
    props: ({ model }, { topic, type }) => {
      // TODO(burdon): Note this type may not be the message type above.
      const objects = model.getObjectsByType(type);

      return {
        topic,
        type,

        items: objects.map(({ id, properties: { checked, title } }) => ({ id, checked, title })),

        onCreate: (properties) => {
          model.createItem(type, properties);
        },

        onUpdate: (id, properties) => {
          model.updateItem(id, properties);
        },

        onDelete: (id) => {
          model.deleteItem(id);
        }
      };
    }
  })
)(ListComponent);
