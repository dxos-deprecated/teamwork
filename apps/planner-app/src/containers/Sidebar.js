//
// Copyright 2018 Wireline, Inc.
//

import { Chance } from 'chance';
import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import PlannerIcon from '@material-ui/icons/AssessmentOutlined';

import { PartyTree, PartyTreeAddItemButton, PartyTreeItem, useAppRouter } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';
import { keyToString } from '@dxos/crypto';

import { useArrayModel } from '../model/useArrayModel';
import { ObjectModel } from '../model/object';
import { BOARD_TYPE } from './Board';

const chance = new Chance();

const useStyles = makeStyles(() => ({
  plannerIcon: {
    transform: 'scale(1, -1)'
  }
}));


/**
 * Documents list.
 * @param {string} topic Current topic.
 */
const Documents = ({ topic }) => {
  const classes = useStyles();
  const boardModel = useArrayModel(topic, BOARD_TYPE);
  const router = useAppRouter();
  const { item } = useParams();

  if (!boardModel) {
    return null;
  }

  const activeBoardId = ObjectModel.createId(BOARD_TYPE, item);
  const boards = boardModel
    .getItems()
    .filter(board => !board.deleted);

  const handleSelect = documentId => {
    const { id: item } = ObjectModel.parseId(documentId);
    router.push({ topic, item });
  };

  const handleCreate = () => {
    const title = `board-${chance.word()}`;
    const boardId = boardModel.push({ title });
    handleSelect(boardId);
  };

  const handleUpdateTitle = (boardId, title) => {
    boardModel.updateItem(boardId, { title });
  };

  return (
    <Fragment>
      {boards.map(({ id, title }) => (
        <PartyTreeItem
          key={id}
          id={id}
          icon={props => <PlannerIcon className={clsx(props.className, classes.plannerIcon)} />}
          label={title || id}
          isSelected={activeBoardId === id}
          onSelect={() => handleSelect(id)}
          onUpdate={title => handleUpdateTitle(id, title)}
        />
      ))}
      <PartyTreeAddItemButton topic={topic} onClick={handleCreate}>
        Board
      </PartyTreeAddItemButton>
    </Fragment>
  );
};

const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    const topic = keyToString(party.publicKey);
    router.push({ topic });
  };

  return (
    <PartyTree
      parties={parties}
      items={topic => <Documents topic={topic} />}
      selected={topic}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
