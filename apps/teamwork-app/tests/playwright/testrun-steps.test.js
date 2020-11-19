//
// Copyright 2020 DXOS.org
//

import { launchUsers } from './utils/launch-users.js';

describe('Perform testrun steps', () => {
  let userA, userB, partyName;

  const store = {
    messenger: {
      messengerName: 'Testing Chat',
      message: 'Testing message'
    },
    taskList: {
      taskListName: 'Testing Task List',
      taskName: 'New test task name'
    },
    board: {
      boardName: 'Testing Planner',
      newColumnName: 'New Column',
      cardA: 'Content of card A',
      cardB: 'Content of card B',
      cardC: 'Content of card C',
      labelName: 'red',
      firstColumnName: undefined
    }
  };

  beforeAll(async function () {
    jest.setTimeout(1e6);
    const setup = await launchUsers();
    userA = setup.userA;
    userB = setup.userB;
    partyName = setup.partyName;
  });

  afterAll(async function () {
    userA && await userA.closeBrowser();
    userB && await userB.closeBrowser();
  });

  describe('Test TaskList', function () {
    const { taskListName, taskName } = store.taskList;

    beforeAll(async function () {
        await userA.partyManager.addItemToParty(partyName, 'Tasks', taskListName);
        await userB.partyManager.enterItemInParty(partyName, taskListName);
    });

    afterAll(async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Add task', async function () {
      await userA.tasksManager.addTask(taskName);
      expect(await userB.tasksManager.isTaskExisting(taskName)).toBeTruthy();
    });

    it('Check task', async function () {
      await userB.tasksManager.checkTask(taskName);
      expect(await userA.tasksManager.isTaskChecked(taskName)).toBeTruthy();
    });

    it('Uncheck task', async function () {
      await userA.tasksManager.uncheckTask(taskName);
      expect(await userB.tasksManager.isTaskUnchecked(taskName)).toBeTruthy();
    });

    it('Delete task', async function () {
      await userB.tasksManager.deleteTask(taskName);
      expect(await userA.tasksManager.isTaskDeleted(taskName)).toBeTruthy();
    });
  });

  describe('Test Messenger', function () {
    const { messengerName, message } = store.messenger;

    beforeAll(async function () {
      await userA.partyManager.addItemToParty(partyName, 'Messenger', messengerName);
      await userB.partyManager.enterItemInParty(partyName, messengerName);
    });

    afterAll(async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Send message', async function () {
      await userA.messengerManager.sendMessage(message);
      expect(await userB.messengerManager.isMessageExisting(message)).toBeTruthy();
    });
  });

  describe('Test Planner Board', function () {
    const { boardName, newColumnName, cardA, cardB, cardC } = store.board;
    let { firstColumnName } = store.board;

    beforeAll(async function () {
      await userA.partyManager.addItemToParty(partyName, 'Board', boardName);
      await userB.partyManager.enterItemInParty(partyName, boardName);
    });

    afterAll(async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Add new column', async function () {
      const initialColumnsNumber = 3;
      userB.waitUntil(async () => {
        return (await userB.boardManager.getColumnsNames()).length === initialColumnsNumber;
      });
      await userA.boardManager.addNewColumn();
      await userB.waitUntil(async () => {
        const columnNumber = (await userB.boardManager.getColumnsNames()).length;
        return columnNumber > initialColumnsNumber;
      });
      expect((await userB.boardManager.getColumnsNames()).length).toEqual(initialColumnsNumber + 1);
    });

    it('Rename column', async function () {
      await userA.boardManager.renameColumn('New List', newColumnName);
      expect(await userB.boardManager.isColumnExisting(newColumnName)).toBeTruthy();
    });

    it('Add items in column', async function () {
      firstColumnName = (await userA.boardManager.getColumnsNames())[0];
      await userA.boardManager.addCardInColumn(cardA, firstColumnName);
      await userA.boardManager.addCardInColumn(cardB, firstColumnName);
      await userA.boardManager.addCardInColumn(cardC, firstColumnName);
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardB, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardC, firstColumnName)).toBeTruthy();
    });

    it.skip('Drag item between columns', async function () {});

    it('Archive item in column', async function () {
      await userA.boardManager.archiveCard(cardA, firstColumnName);
      expect(await userA.boardManager.isCardDeleted(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardDeleted(cardA, firstColumnName)).toBeTruthy();
    });

    it('Show archived item in column', async function () {
      await userB.boardManager.showArchivedCards(firstColumnName);
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
    });

    it('Restore archived item in column', async function () {
      await userB.boardManager.restoreCard(cardA, firstColumnName);
      expect(await userA.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
    });

    it.skip('Add label to item in column', async function () {});

    it.skip('Change label name', async function () {});

    it.skip('Remove item\'s label in column', async function () {});
  });

  describe('Test Party actions', function () {
    const { taskListName } = store.taskList;

    it('Archive item', async function () {
      await userA.partyManager.archiveItemInParty(partyName, taskListName);
      expect(await userB.partyManager.isItemDeleted(partyName, taskListName)).toBeTruthy();
    });

    it('Show archived items', async function () {
      await userA.partyManager.showArchivedItems(partyName);
      expect(await userB.partyManager.isItemDeleted(partyName, taskListName)).toBeTruthy();
      expect(await userA.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
    });

    it('Restore archived items', async function () {
      await userA.partyManager.restoreItemInParty(partyName, taskListName);
      expect(await userA.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
      expect(await userB.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
    });
  });
});
