//
// Copyright 2020 DXOS.org
//

import { isSelectorExisting } from './shared';

export class MessengerManager {
  page = null;
  inputSelector = '[contenteditable=\'true\']';

  constructor (_page) {
    this.page = _page;
  }

  async sendMessage (message) {
    await this.page.fill(this.inputSelector, message);
    await this.page.keyboard.press('Enter');
  }

  async isMessageExisting (messageToFind) {
    const messageSelector = `.MuiTableRow-root >> text=${messageToFind}`;
    return await isSelectorExisting(this.page, messageSelector);
  }

  async referenceItem (itemName) {
    // TODO: fill it when referencing items will work for firefox
    // await this.page.click(this.inputSelector);
    // await this.page.keyboard.press('Shift+3');
  }
}
