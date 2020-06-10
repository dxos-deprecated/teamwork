//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';

export interface PartyGroupProps {
  party: any,
}

export const PartyGroup = ({ party }: PartyGroupProps) => {
  console.log('group for party', party);
  return (<>
    <div>Party: {party.displayName}</div>
    <div>Documents in this party:</div>
    
  </>);
};
