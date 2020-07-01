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
import { EditableText } from '@dxos/react-ux';

import Header from '../components/Header';
import { useItems } from '../model';

const chance = new Chance();

const Tasks = ({  }) => {
  const history = useHistory();
  const { topic } = useParams();
  const model = useItems(topic);

  // Create item.
  const handleCreateItem = () => {
    onCreate({
      title: chance.sentence({ words: 3 })
    });
  };

  console.log('model.getAllViews()', model.getAllViews())

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
          {[{id: 4}].map(({id}) => (
            <ListItem
              key={id}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  disableRipple
                  checked={false}
                  // onChange={() => onUpdate(id, { checked: !checked })}
                />
              </ListItemIcon>

              <p>{id}</p>

              {/* <EditableText value={title} onUpdate={title => onUpdate(id, { title })} /> */}

              <ListItemSecondaryAction>
                {/* <IconButton edge="end" aria-label="delete" onClick={() => onDelete(id)}>
                  <DeleteIcon />
                </IconButton> */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Tasks;
