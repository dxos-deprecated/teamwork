//
// Copyright 2020 DXOS.org
//

import toHtml from 'hast-util-to-html';
import rehypeParse from 'rehype-parse';
import rehype2remark from 'rehype-remark';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkBlockElements from 'remark-parse/lib/block-elements';
import remarkStringify from 'remark-stringify';
import unified from 'unified';
import * as Y from 'yjs';

import { remark2XmlFragment } from './remark-xml-fragment';
import { xmlFragmentTransform } from './xml-fragment-remark';

export function docToMarkdown (doc) {
  const fragment = doc.getXmlFragment('content');

  const html = htmlProcessor()
    .use(xmlFragmentTransform)
    .use(rehypeStringify)
    .processSync(fragment.toString());

  const result = htmlProcessor()
    .use(rehype2remark, {
      handlers: {
        block_react_element: reactElement,
        inline_react_element: reactElement
      }
    })
    .use(remarkStringify, { listItemIndent: 1, tightDefinitions: true })
    .processSync(html);

  return result.toString();
}

export function markdownToDoc (markdown, doc = new Y.Doc()) {
  markdownProcessor()
    .use(remark2XmlFragment, doc)
    .processSync(markdown);

  return doc;
}

function htmlProcessor (processor = unified()) {
  return processor.use(rehypeParse, { fragment: true });
}

function markdownProcessor (processor = unified()) {
  return processor
    .use(remarkParse, {
      blocks: [...remarkBlockElements, 'block_react_element']
    })
    .use(remarkBreaks);
}

function reactElement (h, node) {
  return h(node, 'html', toHtml(node));
}
