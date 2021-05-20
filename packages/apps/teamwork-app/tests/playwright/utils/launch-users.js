//
// Copyright 2020 DXOS.org
//

import { User } from './User';

/**
 * Launch browser and create wallet for 2 users. One of them creates a party and generates a sharelink, the other one uses it to join the party.
 */
export const launchUsers = async (browser, startUrl) => {
  const userA = new User('UserA');
  const userB = new User('UserB');
  const initialPartyName = 'Initial Party';

  await userA.launch(browser, startUrl);
  await userA.createWallet();
  await userA.partyManager.createParty(initialPartyName);
  const shareLink = await userA.partyManager.inviteUnknownUserToParty(1);

  await userB.launch(browser, startUrl);
  await userB.createWallet();
  await userB.partyManager.redeemParty(shareLink);
  const passcode = await userA.partyManager.getPasscode();
  await userB.partyManager.fillPasscode(passcode);

  await userB.partyManager.isUserInParty(initialPartyName, userA.username);
  await userA.partyManager.closeSharePartyDialog();

  await userB.waitUntil(async () => await userB.partyManager.isDialogClosed());
  return { userA, userB, initialPartyName };
};
