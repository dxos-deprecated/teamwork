//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import path from 'path';

import { BoardManager } from './BoardManager';
import { EditorManager } from './EditorManager';
import { MessengerManager } from './MessengerManager';
import { PartyManager } from './PartyManager';
import { TasksManager } from './TasksManager';
import { genericSelectors, isSelectorDeleted, selectors, waitUntil } from './util';

const { textButtonSelector, dialogSelector } = selectors;
const { attributeSelector } = genericSelectors;

// const headless = !!process.env.CI;
const headless = true;
// const slowMo = process.env.CI ? 0 : 200;
const slowMo = 0;

export class User {
    browser = null
    context = null
    page = null

    username = '';
    seedPhrasePath = '';

    constructor (_username) {
      this.username = _username;
    }

    async launchBrowser (_browser, _startUrl) {
      this.browser = await _browser.launch({ headless, slowMo });
      this.context = await this.browser.newContext({
        recordVideo: { dir: `tests/playwright/videos/${this.username}` },
        acceptDownloads: true
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
      this.editorManager = new EditorManager(this.page);
    }

    async createWallet () {
      await this.page.click(textButtonSelector('Create Wallet'));

      await this.page.fill('input', this.username);

      const nextButtonSelector = textButtonSelector('Next');
      await this.page.click(nextButtonSelector);

      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        this.page.click(textButtonSelector('Download'))
      ]);
      this.seedPhrasePath = path.join(__dirname, '../downloads', this.username + download.suggestedFilename());
      await download.saveAs(this.seedPhrasePath);
      await this.page.click(nextButtonSelector);

      await this.page.click(textButtonSelector('Finish'));
    }

    async recoverWallet (_seedPhrasePath) {
      await this.page.click(textButtonSelector('Recover Wallet'));

      const seedPhrase = fs.readFileSync(_seedPhrasePath, 'utf8');
      await this.page.fill('input', seedPhrase);
      await this.page.click(textButtonSelector('Restore'));

      const recoveringHeadingSelector = dialogSelector + attributeSelector('*', 'text()', 'Recovering...');
      await this.waitUntil(async () => await isSelectorDeleted(this.page, recoveringHeadingSelector));
    }

    async goToHomePage () {
      const homeButtonSelector = 'header >> button[aria-label="home"]';
      await this.page.click(homeButtonSelector);
      await this.page.waitForSelector(homeButtonSelector, { state: 'detached' });
    }

    async getAccountName () {
      const accountIconSelector = '//header//button[@title]';
      await this.page.waitForSelector(accountIconSelector);
      return await this.page.$eval(accountIconSelector, accountIcon => accountIcon.getAttribute('title'));
    }

    async waitUntil (predicate) {
      await waitUntil(this.page, predicate);
    }
}
