//
// Copyright 2020 DXOS.org
//

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
    try {
      await this.page.waitForSelector(messageSelector, { timeout: 2 * 1e3 });
      return !!(await this.page.$(messageSelector));
    } catch {
      return false;
    }
  }
}
