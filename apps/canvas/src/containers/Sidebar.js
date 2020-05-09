//
// Copyright 2018 DxOS.org
//

import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import DocumentIcon from '@material-ui/icons/AspectRatio';

import { keyToString } from '@dxos/crypto';
import { PartyTreeAddItemButton, PartyTree, PartyTreeItem, useAppRouter } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';

import { useDocumentList, useDocument } from '../model';

const TreeItem = ({ document, topic, active, onSelect }) => {
  const [, updateDocument] = useDocument(topic, document.id);
  return (
    <PartyTreeItem
      key={document.id}
      id={document.id}
      label={document.title || document.id}
      icon={DocumentIcon}
      isSelected={active === document.id}
      onSelect={onSelect}
      onUpdate={title => updateDocument({ title })}
    />
  );
};

/**
 * Documents list.
 * @param {string} topic Current topic.
 */
const Documents = ({ topic }) => {
  if (!topic) {
    return null;
  }

  const router = useAppRouter();
  const { item: active } = useParams();
  const [documents, createDocument] = useDocumentList(topic);

  const handleSelect = (documentId) => {
    router.push({ topic, item: documentId });
  };

  const handleCreate = () => {
    // TODO(burdon): Generate title (appkit).
    const title = 'New Document';
    const documentId = createDocument(title);
    handleSelect(documentId);
  };

  return (
    <Fragment>
      {documents.map(document => (
        <TreeItem
          key={document.id}
          document={document}
          active={active}
          topic={topic}
          onSelect={() => handleSelect(document.id)}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={handleCreate}>Document</PartyTreeAddItemButton>
    </Fragment>
  );
};

const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleSelect = (topic) => {
    router.push({ topic });
  };

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    handleSelect(keyToString(party.publicKey));
  };

  return (
    <PartyTree
      parties={parties}
      items={topic => <Documents topic={topic} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
