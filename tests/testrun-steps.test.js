//
// Copyright 2020 DXOS.org
//

import chai from 'chai';
import mocha from 'mocha';

import { launchUsers } from './utils/launch-users.js';

const { expect, assert } = chai;
const { before, after, describe, it } = mocha;

describe('Perform testrun steps', function () {
  this.timeout(1e6);

  let userA, userB, partyName;

  const store = {
    messengerName: 'New Chat',
    message: 'This is very secret message',
    taskListName: 'A Couple of Tasks',
    taskName: 'Do the laundry'
  };

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

  describe.skip('Test Messenger', async function () {
    it('User A creates new Messenger and both users get in', async function () {
      // Refactor this to expect.not.to.throw
      try {
        const { messengerName } = store;
        await userA.partyManager.addItemToParty(partyName, 'Messenger', messengerName);
        await userB.partyManager.enterItemInParty(partyName, messengerName);
      } catch {
        assert.fail();
      }
      assert.true();
    });

    it('User A sends message to UserB and UserB can see it', async function () {
      const { message } = store;
      await userA.messengerManager.sendMessage(message);
      // eslint-disable-next-line no-unused-expressions
      expect(await userB.messengerManager.isMessageExisting(message)).to.be.true;
    });

    it('Users go to Home page', async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });
  });

  describe('Test TaskList', function () {
    it('Test TaskList', async function () {
      const { taskListName } = store;
      await userA.partyManager.addItemToParty(partyName, 'Tasks', taskListName);
      await userB.partyManager.enterItemInParty(partyName, taskListName);

      const { taskName } = store;
      await userA.tasksManager.addTask(taskName);
      // eslint-disable-next-line no-unused-expressions
      expect(await userB.tasksManager.isTaskExisting(taskName)).to.be.equal(true, 'UserB does not see task created by UserA');

      await userB.tasksManager.checkTask(taskName);
      expect(await userA.tasksManager.isTaskChecked(taskName)).to.be.equal(true, 'UserA does not see checked box');
    });
  });
});
