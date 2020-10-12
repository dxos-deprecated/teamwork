//
// Copyright 2020 DXOS.org
//

const chai = require('chai');
const mocha = require('mocha');
const { firefox } = require('playwright');

const { User } = require('../User.js');

const { expect } = chai;
const { beforeEach, afterEach, describe, it } = mocha; // eslint-disable-line no-unused-vars

const timeout = 1e6;
const startUrl = 'localhost:8080';
const browser = firefox;

describe('Share party', () => {
    let userA = null;
    let userB = null;

    beforeEach(() => {
        userA = new User('UserA');
        userB = new User('UserB');
    });

    // afterEach(() => {
    //     userA.closeBrowser();
    //     userB.closeBrowser();
    // });

    it('UserB sees specific party after pasting invitation link the first time', async () => {
        await userA.launchBrowser(browser, startUrl);
        await userA.createWallet();
        const partyName = await userA.createParty();
        await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(browser, await userA.getShareLink());
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        expect(await userB.getFirstPartyName()).to.be.equal(partyName);
    }).timeout(timeout);

    it('UserB has UserA icon in his party after pasting invitation link the first time', async () => {
        await userA.launchBrowser(browser, startUrl);
        await userA.createWallet();
        const partyName = await userA.createParty();
        await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(browser, await userA.getShareLink());
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        expect(await userB.isUserInParty(partyName, userA.name)).to.be.true;
    }).timeout(timeout);

    it.only('UserB sees specific party after pasting invitation link second time', async () => {
        await userA.launchBrowser(browser, startUrl);
        await userA.createWallet();
        const firstPartyName = await userA.createParty();
        const shareLink1 = await userA.inviteUnknownUserToParty(1);

        await userB.launchBrowser(browser, shareLink1);
        await userB.createWallet();
        await userB.fillPasscode(await userA.getPasscode());

        // NOTE: as long as userB does not see userA in party, userA has some weird name of userB
        await userB.isUserInParty(firstPartyName, userA.name);
        // const initialPartyNames = await userB.getPartyNames();

        await userA.closeSharePartyDialog();
        const secondPartyName = await userA.createParty();
        const shareLink2 = await userA.inviteKnownUserToParty(secondPartyName, userB.name);

        await userB.goToPage(shareLink2);
        await userB.waitUntil(async () => {
            return (await userB.getPartyNames()).length === 2;
        });
        const currentPartyNames = await userB.getPartyNames();
        expect(currentPartyNames.length).to.be.equal(2);

        // const newName = currentPartyNames.filter(name => !initialPartyNames.includes(name));

    }).timeout(timeout);
});
