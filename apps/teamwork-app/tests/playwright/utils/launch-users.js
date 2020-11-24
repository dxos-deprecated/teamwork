//
// Copyright 2020 DXOS.org
//

import { firefox } from 'playwright';

import { User } from './User';

const browser = firefox;
const startUrl = 'localhost:8080';

/**
 * Launch browser and create wallet for 2 users. One of them creates a party and generates a sharelink, the other one uses it to join the party.
 */
export const launchUsers = async () => {
    const userA = new User('UserA');
    const userB = new User('UserB');

    await userA.launch(browser, startUrl);
    await userA.createWallet();
    const partyName = await userA.partyManager.createParty();
    const shareLink = await userA.partyManager.inviteUnknownUserToParty(1);

    await userB.launch(browser, startUrl);
    await userB.createWallet();
    await userB.partyManager.redeemParty(shareLink);
    const passcode = await userA.partyManager.getPasscode();
    await userB.partyManager.fillPasscode(passcode);

    await userB.partyManager.isUserInParty(partyName, userA.username);
    await userA.partyManager.closeSharePartyDialog();

    return { userA, userB, partyName };
};
