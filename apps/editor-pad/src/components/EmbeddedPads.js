import React from 'react';
import ReactDOM from 'react-dom';

import Pad from './Pad';

const EmbeddedPads = ({ embeddedPads, pads }) => {
  return embeddedPads.map(({ node: { attrs: { dataPad } }, domNode }) => {
    const { main: PadComponent, icon } = pads.find(pad => pad.type === dataPad.type);

    return ReactDOM.createPortal(
      <Pad title={dataPad.title} icon={icon}>
        <PadComponent {...dataPad} />
      </Pad>,
      domNode
    );
  });
};

export default EmbeddedPads;
