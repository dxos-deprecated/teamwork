//
// Copyright 2020 DXOS.org
//

import { selectors, genericSelectors, isSelectorExisting } from './util';

const { attributeSelector, classSelector } = genericSelectors;
const { listItemSelector } = selectors;

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

  async embedExistingItem (itemName) {
    await this.page.click(this.documentSelector, { button: 'right' });
    const itemSelector = classSelector('div', 'MuiPopover-paper') + listItemSelector(itemName);
    await this.page.click(itemSelector);
  }

  async isMessengerWithMessageExisting (message) {
    const messageSelector =
      this.documentSelector +
      classSelector('div', 'padContainer') +
      `//table//*[contains(text(),"${message}")]`;
    return await this._isSelectorExisting(messageSelector);
  }

  async isTaskListWithTaskExisting (task) {
    const taskSelector =
      this.documentSelector +
      classSelector('div', 'padContainer') +
      `//li//*[contains(text(),"${task}")]`;
    return await this._isSelectorExisting(taskSelector);
  }

  async isBoardWithCardExisting (cardTitle) {
    const cardTitleSelector =
      this.documentSelector +
      classSelector('div', 'MuiCard') +
      `//*[contains(text(), "${cardTitle}")]`;
    return await this._isSelectorExisting(cardTitleSelector);
  }
}
