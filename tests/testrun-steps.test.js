//
// Copyright 2020 DXOS.org
//

import chai from 'chai';
import mocha from 'mocha';

import { launchUsers } from './utils/launch-users.js';

const { expect } = chai;
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

  describe('Test TaskList', function () {
    it('Test TaskList', async function () {
      const { taskListName, taskName } = store;
      await userA.partyManager.addItemToParty(partyName, 'Tasks', taskListName);
      await userB.partyManager.enterItemInParty(partyName, taskListName);

      await userA.tasksManager.addTask(taskName);
      expect(await userB.tasksManager.isTaskExisting(taskName)).to.be.equal(true, 'UserB does not see task created by UserA');

      await userB.tasksManager.checkTask(taskName);
      expect(await userA.tasksManager.isTaskChecked(taskName)).to.be.equal(true, 'UserB checked box and UserA does not see box checked');

      await userA.tasksManager.uncheckTask(taskName);
      expect(await userB.tasksManager.isTaskChecked(taskName)).to.be.equal(false, 'UserA unchecked box UserB does not see box unchecked');

      await userB.tasksManager.deleteTask(taskName);
      expect(await userA.tasksManager.isTaskDeleted(taskName)).to.be.equal(true, 'UserA still sees task deleted by UserB');

      await userA.goToHomePage();
      await userB.goToHomePage();
    });
  });

  describe('Test Messenger', function () {
    it('Test Messenger', async function () {
      const { messengerName, message, itemName } = store;
      await userA.partyManager.addItemToParty(partyName, 'Messenger', messengerName);
      await userB.partyManager.enterItemInParty(partyName, messengerName);

      await userA.messengerManager.sendMessage(message);
      // eslint-disable-next-line no-unused-expressions
      expect(await userB.messengerManager.isMessageExisting(message)).to.be.equal(true, 'UserB does not see message sent by UserA');

      await userA.messengerManager.referenceItem(itemName);

      // await userA.goToHomePage();
      // await userB.goToHomePage();
    });
  });

  // describe('Test Planner Board', function () {

  // })
});
