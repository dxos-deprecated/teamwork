//
// Copyright 2020 DXOS.org
//

export class MessengerManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async sendMessage (message) {
    await this.page.fill(`[contenteditable='true']`, message);
    await this.page.keyboard.press('Enter');
  }

  async isMessageExisting (message) {
      const messageSelector = `.MuiTableRow-root >> text=${message}`;
      await this.page.waitForSelector(messageSelector, { timeout: 2 * 1e3 });
      return (await this.page.$(messageSelector)) !== null;
  }
}