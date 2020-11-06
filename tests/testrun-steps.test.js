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
    const { taskListName, taskName } = store;

    before(async function () {
        await userA.partyManager.addItemToParty(partyName, 'Tasks', taskListName);
        await userB.partyManager.enterItemInParty(partyName, taskListName);
    });

    after(async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Add task', async function () {
      await userA.tasksManager.addTask(taskName);
      expect(await userB.tasksManager.isTaskExisting(taskName)).to.be.equal(true, 'UserB does not see task created by UserA');
    });

    it('Check task', async function () {
      await userB.tasksManager.checkTask(taskName);
      expect(await userA.tasksManager.isTaskChecked(taskName)).to.be.equal(true, 'UserB checked box and UserA does not see box checked');
    });

    it('Uncheck task', async function () {
      await userA.tasksManager.uncheckTask(taskName);
      expect(await userB.tasksManager.isTaskChecked(taskName)).to.be.equal(false, 'UserA unchecked box UserB does not see box unchecked');
    });

    it('Delete task', async function () {
      await userB.tasksManager.deleteTask(taskName);
      expect(await userA.tasksManager.isTaskDeleted(taskName)).to.be.equal(true, 'UserA still sees task deleted by UserB');
    });
  });

  describe.skip('Test Messenger', function () {
    const { messengerName, message } = store;

    before(async function () {
      await userA.partyManager.addItemToParty(partyName, 'Messenger', messengerName);
      await userB.partyManager.enterItemInParty(partyName, messengerName);
    });

    after(async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Send message', async function () {
      await userA.messengerManager.sendMessage(message);
      expect(await userB.messengerManager.isMessageExisting(message)).to.be.equal(true, 'UserB does not see message sent by UserA');
    });
  });

  // describe('Test Planner Board', function () {

  // })

  describe('Test Party actions', function () {
    const { taskListName } = store;

    it('Archive item', async function () {
      await userA.partyManager.archiveItemInParty(partyName, taskListName);
      expect(await userB.partyManager.isItemDeleted(partyName, taskListName)).to.be.equal(true, 'UserB still sees item deleted by UserA');
    });
    it('Show archived items', async function () {
      await userA.partyManager.showArchivedItems(partyName);
      expect(await userA.partyManager.isItemExisting(partyName, taskListName)).to.be.equal(true, 'UserA does not see archived item');
    });
    // it('Restore archived items', async function () {
      
    // });
  });
});
