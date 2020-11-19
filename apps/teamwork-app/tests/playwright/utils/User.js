//
// Copyright 2020 DXOS.org
//

import { BoardManager } from './BoardManager';
import { MessengerManager } from './MessengerManager';
import { PartyManager } from './PartyManager';
import { TasksManager } from './TasksManager';
import { selectors, waitUntil } from './util';

const { textButtonSelector } = selectors;

const headless = !!process.env.CI;
const slowMo = process.env.CI ? 0 : 200;

export class User {
    browser = null
    context = null
    page = null

    username = '';
    messengerManager = null;
    partyManager = null;
    boardManager = null;

    constructor (_username) {
      this.username = _username;
    }

    async launchBrowser (_browser, _startUrl) {
      this.browser = await _browser.launch({ headless, slowMo });
      this.context = await this.browser.newContext({
        recordVideo: { dir: `tests/playwright/videos/${this.username}` }
      });
      this.page = await this.context.newPage();
      await this.page.goto(_startUrl, { waitUntil: 'load' });
    }

    async closeBrowser () {
      await this.browser.close();
    }

    async goToPage (url) {
      await this.page.goto(url);
    }

    async launch (_browser, _startUrl) {
      await this.launchBrowser(_browser, _startUrl);
      this.messengerManager = new MessengerManager(this.page);
      this.partyManager = new PartyManager(this.page);
      this.tasksManager = new TasksManager(this.page);
      this.boardManager = new BoardManager(this.page);
    }

    async createWallet () {
      const walletButtonSelector = textButtonSelector('Create Wallet');
      await this.page.click(walletButtonSelector);

      await this.page.fill('input', this.username);

      const nextButtonSelector = textButtonSelector('Next');
      await this.page.click(nextButtonSelector);
      await this.page.click(nextButtonSelector);

      const finishButtonSelector = textButtonSelector('Finish');
      await this.page.click(finishButtonSelector);
    }

    async goToHomePage () {
      const homeButtonSelector = 'header >> button[aria-label="home"]';
      await this.page.click(homeButtonSelector);
      await this.page.waitForSelector(homeButtonSelector, { state: 'detached' });
    }

    async waitUntil (predicate) {
      await waitUntil(this.page, predicate);
    }
}
