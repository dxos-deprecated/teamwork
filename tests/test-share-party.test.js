//
// Copyright 2020 DXOS.org
//

import chai from 'chai';
import mocha from 'mocha';

import { launchUsers } from './launch-users.js';

const { expect } = chai;
const { beforeEach, afterEach, describe, it } = mocha; // eslint-disable-line no-unused-vars

describe('Share party', function () {
    this.timeout(1e6);

    let userA, userB, partyName;

    beforeEach(async function () {
        const setup = await launchUsers();
        userA = setup.userA;
        userB = setup.userB;
        partyName = setup.partyName;
    });

    afterEach(async function () {
        userA && await userA.closeBrowser();
        userB && await userB.closeBrowser();
    });

    it('UserB sees specific party after pasting invitation link the first time', async function () {
        await userB.waitUntil(async () => {
            return (await userB.getPartyNames()).length > 0;
        });

        expect(await userB.getPartyNames()).to.not.be.empty;
        expect((await userB.getPartyNames())[0]).to.be.equal(partyName);
    });

    it('UserB has UserA icon in his party after pasting invitation link the first time', async function () {
        expect(await userB.isUserInParty(partyName, userA.username)).to.be.true;
    });

    // skipped until the offline invitation flow is re-implemented in SDK
    it.skip('UserB sees specific party after pasting invitation link second time', async function () {
        await userB.isUserInParty(partyName, userA.username);

        await userA.closeSharePartyDialog();
        const newPartyName = await userA.createParty();
        const shareLink = await userA.inviteKnownUserToParty(newPartyName, userB.username);

        await userB.goToPage(shareLink);
        await userB.waitUntil(async () => {
            return (await userB.getPartyNames()).length === 2;
        });
        const currentPartyNames = await userB.getPartyNames();

        expect(currentPartyNames.length).to.be.equal(2);
    });
});
