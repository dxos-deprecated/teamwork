
//
// Copyright 2020 DXOS.org
//
import { firefox } from 'playwright';

import { UserPOM } from './UserPOM.js';

const browser = firefox;
const startUrl = 'localhost:8080';

export const launchUsers = async () => {
    const userA = new UserPOM('UserA');
    const userB = new UserPOM('UserB');

    await userA.launchBrowser(browser, startUrl);
    await userA.createWallet();
    const partyName = await userA.createParty();
    const shareLink = await userA.inviteUnknownUserToParty(1);

    await userB.launchBrowser(browser, shareLink);
    await userB.createWallet();
    await userB.fillPasscode(await userA.getPasscode());

    return { userA, userB, partyName };
};
