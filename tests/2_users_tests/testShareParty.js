//
// Copyright 2020 DXOS.org
//

const chai = require('chai');
const mocha = require('mocha');
const { firefox } = require('playwright');

const { User } = require('../User.js');

const { expect } = chai;
const { beforeEach, afterEach, describe, it } = mocha; // eslint-disable-line no-unused-vars

const timeout = 1e5;
const startUrl = 'localhost:8080';

describe('Share party', () => {
    let userA = null;
    let userB = null;

    beforeEach(() => {
        userA = new User('UserA');
        userB = new User('UserB');
    });

    afterEach(() => {
        userA.closeBrowser();
        userB.closeBrowser();
    });

    it('UserB sees specific party after pasting invitation link the first time', async () => {
        await userA.launchBrowser(firefox, startUrl);
        await userA.createWallet();
        const partyName = await userA.createParty();
        await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(firefox, await userA.getShareLink());
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        expect(await userB.getFirstPartyName()).to.be.equal(partyName);
    }).timeout(timeout);

    it('UserB has UserA icon in his party after pasting invitation link the first time', async () => {
        await userA.launchBrowser(firefox, startUrl);
        await userA.createWallet();
        const partyName = await userA.createParty();
        await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(firefox, await userA.getShareLink());
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        expect(await userB.isUserInParty(partyName, userA.name)).to.be.true;
    }).timeout(timeout);

    it.skip('UserB sees specific party after pasting invitation link second time', async () => {
        await userA.launchBrowser(firefox, startUrl);
        await userA.createWallet();
        await userA.createParty();
        await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(firefox, await userA.getShareLink());
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        const partyName = await userA.createParty();
        await userA.inviteKnownUserToParty(partyName);
    });
});
