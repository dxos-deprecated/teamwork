//
// Copyright 2020 DXOS.org
//

import { isSelectorExisting } from "./shared";

export class MessengerManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async sendMessage (message) {
    await this.page.fill('[contenteditable=\'true\']', message);
    await this.page.keyboard.press('Enter');
  }

  async isMessageExisting (messageToFind) {
    const messageSelector = `.MuiTableRow-root >> text=${messageToFind}`;
    return await isSelectorExisting(this.page, messageSelector);
  }
}
