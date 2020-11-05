//
// Copyright 2020 DXOS.org
//

import { BrowserPOM } from './BrowserPOM.js';
import { MessengerManager } from './MessengerManager';
import { PartyManager } from './PartyManager';
import { TasksManager } from './TasksManager';
import { textButtonSelector } from './shared';

export class UserPOM extends BrowserPOM {
    username = '';
    messengerManager = null;
    partyManager = null;

    constructor (_username) {
        super();
        this.username = _username;
    }

    async launch (_browser, _startUrl) {
        await this.launchBrowser(_browser, _startUrl);
        this.messengerManager = new MessengerManager(this.page);
        this.partyManager = new PartyManager(this.page);
        this.tasksManager = new TasksManager(this.page);
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
}
