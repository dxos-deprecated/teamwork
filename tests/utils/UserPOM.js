//
// Copyright 2020 DXOS.org
//

import { BrowserPOM } from './BrowserPOM.js';
import { MessengerManager } from './MessengerManager';
import { PartyManager } from './PartyManager';
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
        console.log("Page: ", this.page);
        this.messengerManager = new MessengerManager(this.page);
        this.partyManager = new PartyManager(this.page);
    }

    async createWallet () {
        const walletButtonSelector = textButtonSelector('Create Wallet');
        await this.page.waitForSelector(walletButtonSelector);
        await this.page.click(walletButtonSelector);

        await this.page.waitForSelector('input');
        await this.page.fill('input', this.username);

        const nextButtonSelector = textButtonSelector('Next');
        await this.page.click(nextButtonSelector);
        await this.page.waitForSelector(nextButtonSelector);
        await this.page.click(nextButtonSelector);

        const finishButtonSelector = textButtonSelector('Finish');
        await this.page.waitForSelector(finishButtonSelector);
        await this.page.click(finishButtonSelector);
    }
}
