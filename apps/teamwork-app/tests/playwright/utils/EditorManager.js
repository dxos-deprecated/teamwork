//
// Copyright 2020 DXOS.org
//

import { genericSelectors, isSelectorExisting } from './util';

const { attributeSelector } = genericSelectors;

export class EditorManager {
  page = null;
  documentSelector = attributeSelector('div', '@contenteditable', 'true');

  constructor (_page) {
    this.page = _page;
  }

  async _isSelectorExisting (selector) {
    return await isSelectorExisting(this.page, selector);
  }

  async write (text) {
    await this.page.click(this.documentSelector);
    await this.page.fill(this.documentSelector, text);
  }

  async isTextExisting (text) {
    const textSelector = this.documentSelector + `//*[contains(text(), "${text}")]`;
    return await this._isSelectorExisting(textSelector);
  }
}
