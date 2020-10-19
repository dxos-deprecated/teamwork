
//
// Copyright 2020 DXOS.org
//
import { firefox } from 'playwright';

import { UserPOM } from './UserPOM.js';

const browser = firefox;
const startUrl = 'localhost:8080';

/**
 * Launch browser and create wallet for 2 users. One of them creates a party and  generates a sharelink, the other one uses it to join the party.
 */
export const launchUsers = async () => {
    const userA = new UserPOM('UserA');
    const userB = new UserPOM('UserB');

    await userA.launchBrowser(browser, startUrl);
    await userA.createWallet();
    const partyName = await userA.createParty();
    const shareLink = await userA.inviteUnknownUserToParty(1);

    await userB.launchBrowser(browser, startUrl);
    await userB.createWallet();
    await userB.redeemParty(shareLink);
    await userB.fillPasscode(await userA.getPasscode());

    return { userA, userB, partyName };
};
