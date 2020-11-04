//
// Copyright 2020 DXOS.org
//

import chai from 'chai';
import mocha from 'mocha';

import { launchUsers } from './utils/launch-users.js';

const { expect } = chai;
const { before, after, describe, it } = mocha;

describe('Testrun steps', function () {
  this.timeout(1e6);

  let userA, userB, partyName;

    before(async function () {
        const setup = await launchUsers();
        userA = setup.userA;
        userB = setup.userB;
        partyName = setup.partyName;
    });

    // after(async function () {
    //   userA && await userA.closeBrowser();
    //   userB && await userB.closeBrowser();
    // });

    it('User A creates new Messenger and both users can get in', async () => {
      await userA.addItemToParty(partyName, 'Messenger', 'New Chat');
    });
});
