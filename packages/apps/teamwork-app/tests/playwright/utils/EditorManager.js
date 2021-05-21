//
// Copyright 2020 DXOS.org
//

import { selectors, genericSelectors, isSelectorExisting, waitUntil } from './util';

const { attributeSelector, classSelector, lastSelector } = genericSelectors;
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

  async toggleMessenger () {
    const initialContentEditables = (await this.page.$$(attributeSelector('div', '@contenteditable', 'true'))).length;
    const messengerButtonSelector = classSelector('div', 'MuiToolbar') + attributeSelector('span', '@title', 'Messenger');
    await this.page.click(messengerButtonSelector);
    await waitUntil(this.page, async () => (
      (await this.page.$$(attributeSelector('div', '@contenteditable', 'true'))).length > initialContentEditables
    ));
  }

  async writeInMessenger (message) {
    const messengerInputSelector = lastSelector(attributeSelector('div', '@contenteditable', 'true'));
    await this.page.click(messengerInputSelector);
    await this.page.fill(messengerInputSelector, message);
    await this.page.keyboard.press('Enter');
  }

  async isMessageExistingInMessenger (message) {
    const messagesContainerSelector = lastSelector(classSelector('div', 'MuiTableContainer'));
    const messageSelector = messagesContainerSelector + attributeSelector('span', 'text()', message);
    return await isSelectorExisting(this.page, messageSelector);
  }
}
