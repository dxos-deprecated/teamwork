//
// Copyright 2020 DxOS, Inc.
//

import React, { useState } from 'react';
import { Chance } from 'chance';

import { keyToString } from '@dxos/crypto';

import { useItemList } from '../model';
import { supportedPads } from '../common';
import { PartyItem } from './PartyItem';
import { DocumentTypeSelectDialog } from '../containers/DocumentTypeSelectDialog';

const chance = new Chance();

export interface PartyGroupProps {
  party: any,
}

export const PartyGroup = ({ party }: PartyGroupProps) => {
  const topic = keyToString(party.publicKey);
  const [typeSelectDialogOpen, setTypeSelectDialogOpen] = useState(false);
  const { items, createItem, editItem } = useItemList(topic, supportedPads.map(pad => pad.type));

  const handleCreate = (type?: string) => {
    setTypeSelectDialogOpen(false);
    if (!type) return;
    const title = `item-${chance.word()}`;
    const documentId = createItem({ __type_url: type, title, mutations: [] });
    // handleSelect(documentId);
  };

  return (<>
    <div>Party: {party.displayName}</div>
    <div>Documents in this party:</div>
    {items.map((item: any, i: number) => <PartyItem key={i} item={item} />)}
    <button onClick={() => setTypeSelectDialogOpen(true)}>Add</button>
    <DocumentTypeSelectDialog open={typeSelectDialogOpen} onSelect={handleCreate} />
  </>);
};
