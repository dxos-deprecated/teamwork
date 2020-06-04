//
// Copyright 2020 Wireline, Inc.
//

const PAD_TYPE_NAME = 'pad';

export class PadNodeView {
  constructor(node) {
    this.node = node;
    this.dom = document.createElement(PAD_TYPE_NAME);
    this.dom.classList.add('pad');
  }
}

export const padSchemaEnhancer = schemaConfig => {
  schemaConfig.nodes[PAD_TYPE_NAME] = {
    group: 'inline',
    content: 'inline*',
    inline: true,
    atom: true,
    draggable: true,
    attrs: {
      dataPad: { default: null }
    },
    parseDOM: [
      {
        tag: PAD_TYPE_NAME,
        getAttrs(dom) {
          return {
            dataPad: JSON.parse(decodeURI(dom.getAttribute('data-pad')))
          };
        }
      }
    ],

    toDOM: node => {
      return [PAD_TYPE_NAME, {
        'data-pad': encodeURI(JSON.stringify(node.attrs.dataPad))
      }, 0];
    },

    // https://github.com/ProseMirror/prosemirror-markdown#class-markdownserializer
    toMarkdown: state => {
      state.write(`__${PAD_TYPE_NAME}__`);
    }
  };

  return schemaConfig;
};

export const createPadNodeView = renderFn => ({ [PAD_TYPE_NAME]: renderFn });

export const createPadNode = (schema, { type, topic, itemId, title }) => {
  return schema.node(PAD_TYPE_NAME, { dataPad: { type, topic, itemId, title } });
};
