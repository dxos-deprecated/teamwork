//
// Copyright 2020 DXOS.org
//

import { firefox } from 'playwright';

import { User } from './utils/User';
import { launchUsers } from './utils/launch-users.js';

const browser = firefox;
const startUrl = 'localhost:8080';

describe('Perform testrun steps', () => {
  let userA, userB, partyName;

  const store = {
    messenger: {
      messengerName: 'Testing Chat',
      message: 'Testing message',
      itemType: 'Messenger'
    },
    taskList: {
      taskListName: 'Testing Task List',
      taskName: 'New test task name',
      itemType: 'Tasks'
    },
    board: {
      boardName: 'Testing Planner',
      itemType: 'Board',
      newColumnName: 'New Column',
      cardA: 'Content of card A',
      cardB: 'Content of card B',
      cardC: 'Content of card C',
      labelName: 'red',
      firstColumnName: undefined
    },
    editor: {
      editorName: 'Testing Editor',
      itemType: 'Documents'
    }
  };

  beforeAll(async () => {
    jest.setTimeout(100 * 1000);
    const setup = await launchUsers(browser, startUrl);
    userA = setup.userA;
    userB = setup.userB;
    partyName = setup.defaultPartyName;
  });

  afterAll(async () => {
    if (userA) {
      await userA.page.waitForTimeout(1000);
      await userA.closeBrowser();
    }
    if (userB) {
      await userB.page.waitForTimeout(1000);
      await userB.closeBrowser();
    }
  });

  describe('Test Party actions', () => {
    const { taskList, board, editor, messenger } = store;
    const { taskListName } = taskList;

    // ISSUE: https://github.com/dxos/teamwork/issues/496
    it.skip('Rename party', async () => {
      const newName = 'Testing Party';
      await userA.partyManager.renameParty(partyName, newName);
      partyName = newName;
      expect(await userA.partyManager.isPartyExisting(newName)).toBeTruthy();
      expect(await userB.partyManager.isPartyExisting(newName)).toBeTruthy();
    });

    it('Add items', async () => {
      await userA.partyManager.addItemToParty(partyName, taskList.itemType, taskList.taskListName);
      await userA.goToHomePage();

      await userA.partyManager.addItemToParty(partyName, board.itemType, board.boardName);
      await userA.goToHomePage();

      await userA.partyManager.addItemToParty(partyName, editor.itemType, editor.editorName);
      await userA.goToHomePage();

      await userA.partyManager.addItemToParty(partyName, messenger.itemType, messenger.messengerName);
      await userA.goToHomePage();

      await userB.waitUntil(async () => {
        return (await userB.partyManager.getItemsNames(partyName)).length === 4;
      });

      const itemsNames = await userB.partyManager.getItemsNames(partyName);

      expect(itemsNames.includes(taskList.taskListName)).toBeTruthy();
      expect(itemsNames.includes(board.boardName)).toBeTruthy();
      expect(itemsNames.includes(editor.editorName)).toBeTruthy();
      expect(itemsNames.includes(messenger.messengerName)).toBeTruthy();
    });

    it('Archive item', async () => {
      await userA.partyManager.archiveItemInParty(partyName, taskListName);
      expect(await userB.partyManager.isItemDeleted(partyName, taskListName)).toBeTruthy();
    });

    it('Show archived items', async () => {
      await userA.partyManager.showArchivedItems(partyName);
      expect(await userA.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
      expect(await userB.partyManager.isItemDeleted(partyName, taskListName)).toBeTruthy();
    });

    it('Restore archived items', async () => {
      await userA.partyManager.restoreItemInParty(partyName, taskListName);
      expect(await userA.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
      expect(await userB.partyManager.isItemExisting(partyName, taskListName)).toBeTruthy();
    });

    // ISSUE: https://github.com/dxos/teamwork/issues/501
    it.skip('Deactivate party', async () => {
      await userA.partyManager.deactivateParty(partyName);
      expect(await userA.partyManager.isPartyInactive(partyName)).toBeTruthy();
    });

    // ISSUE: https://github.com/dxos/teamwork/issues/501
    it.skip('Activate party', async () => {
      await userA.partyManager.activateParty(partyName);
      expect(await userA.partyManager.isPartyActive(partyName)).toBeTruthy();
    });
  });

  describe('Test TaskList', () => {
    const { taskListName, taskName } = store.taskList;

    beforeAll(async () => {
      await userA.partyManager.enterItemInParty(partyName, taskListName);
      await userB.partyManager.enterItemInParty(partyName, taskListName);
    });

    afterAll(async () => {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Add task', async () => {
      await userA.tasksManager.addTask(taskName);
      expect(await userB.tasksManager.isTaskExisting(taskName)).toBeTruthy();
    });

    it('Check task', async () => {
      await userB.tasksManager.checkTask(taskName);
      expect(await userA.tasksManager.isTaskChecked(taskName)).toBeTruthy();
    });

    it('Uncheck task', async () => {
      await userA.tasksManager.uncheckTask(taskName);
      expect(await userB.tasksManager.isTaskUnchecked(taskName)).toBeTruthy();
    });

    it('Delete task', async () => {
      await userB.tasksManager.deleteTask(taskName);
      expect(await userA.tasksManager.isTaskDeleted(taskName)).toBeTruthy();
    });
  });

  describe('Test Messenger', () => {
    const { messengerName, message } = store.messenger;

    beforeAll(async () => {
      await userA.partyManager.enterItemInParty(partyName, messengerName);
      await userB.partyManager.enterItemInParty(partyName, messengerName);
    });

    afterAll(async () => {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Send message', async () => {
      await userA.messengerManager.sendMessage(message);
      expect(await userB.messengerManager.isMessageExisting(message)).toBeTruthy();
    });
  });

  describe('Test Planner Board', () => {
    const { boardName, newColumnName, cardA, cardB, cardC } = store.board;
    let { firstColumnName } = store.board;

    beforeAll(async () => {
      await userA.partyManager.enterItemInParty(partyName, boardName);
      await userB.partyManager.enterItemInParty(partyName, boardName);
    });

    afterAll(async () => {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Add new column', async () => {
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

    it('Rename column', async () => {
      await userA.boardManager.renameColumn('New List', newColumnName);
      expect(await userB.boardManager.isColumnExisting(newColumnName)).toBeTruthy();
    });

    it('Add items in column', async () => {
      firstColumnName = (await userA.boardManager.getColumnsNames())[0];
      await userA.boardManager.addCardInColumn(cardA, firstColumnName);
      await userA.boardManager.addCardInColumn(cardB, firstColumnName);
      await userA.boardManager.addCardInColumn(cardC, firstColumnName);
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardB, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardC, firstColumnName)).toBeTruthy();
    });

    it('Archive item in column', async () => {
      await userA.boardManager.archiveCard(cardA, firstColumnName);
      expect(await userA.boardManager.isCardDeleted(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardDeleted(cardA, firstColumnName)).toBeTruthy();
    });

    it('Show archived item in column', async () => {
      await userB.boardManager.showArchivedCards(firstColumnName);
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
    });

    it('Restore archived item in column', async () => {
      await userB.boardManager.restoreCard(cardA, firstColumnName);
      expect(await userA.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
      expect(await userB.boardManager.isCardExisting(cardA, firstColumnName)).toBeTruthy();
    });

    // it sometimes fails randomly
    it.skip('Drag item between columns', async () => {
      await userA.boardManager.dragCard(cardA, firstColumnName, newColumnName);
      expect(await userB.boardManager.isCardExisting(cardA, newColumnName)).toBeTruthy();
    });
  });

  describe('Test Editor', () => {
    const { editorName } = store.editor;
    const { taskListName, taskName } = store.taskList;

    beforeAll(async () => {
      await userA.partyManager.enterItemInParty(partyName, taskListName);
      await userA.tasksManager.addTask(taskName);
      await userA.goToHomePage();

      await userA.partyManager.enterItemInParty(partyName, editorName);
      await userB.partyManager.enterItemInParty(partyName, editorName);
    });

    afterAll(async () => {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });

    it('Write in editor', async () => {
      const text = 'Testing document content';
      await userA.editorManager.write(text);
      expect(await userB.editorManager.isTextExisting(text)).toBeTruthy();
    });

    it('Embed existing Task List', async () => {
      const { taskListName, taskName } = store.taskList;
      await userA.editorManager.embedExistingItem(taskListName);
      expect(await userB.editorManager.isTaskListWithTaskExisting(taskName)).toBeTruthy();
    });

    it('Embed existing Messenger', async () => {
      const { messengerName, message } = store.messenger;
      await userA.editorManager.embedExistingItem(messengerName);
      expect(await userB.editorManager.isMessengerWithMessageExisting(message)).toBeTruthy();
    });

    it('Embed existing Board', async () => {
      const { boardName, cardA } = store.board;
      await userA.editorManager.embedExistingItem(boardName);
      expect(await userB.editorManager.isBoardWithCardExisting(cardA)).toBeTruthy();
    });
  });

  describe('Test general actions', () => {
    // uses functionality broken in ISSUE: https://github.com/dxos/teamwork/issues/496
    it.skip('Invite known member', async () => {
      const newPartyName = await userA.partyManager.createParty();
      const invitation = await userA.partyManager.inviteKnownUserToParty(newPartyName, userB.username);
      const initialPartyNumber = (await userB.partyManager.getPartyNames()).length;

      await userB.partyManager.redeemPartyOffline(invitation);
      await userB.waitUntil(async () => {
        return (await userB.partyManager.getPartyNames()).length > initialPartyNumber;
      });

      await userA.partyManager.closeSharePartyDialog();

      const partyNames = await userB.partyManager.getPartyNames();
      expect(partyNames.length).toEqual(initialPartyNumber + 1);
      expect(partyNames.includes(newPartyName)).toBeTruthy();
    });

    it('Authorize device', async () => {
      const url = await userA.partyManager.authorizeDevice();
      const newDeviceUser = new User('New Device');
      await newDeviceUser.launch(browser, url);

      const passcode = await userA.partyManager.getAuthorizeDevicePasscode();
      await newDeviceUser.partyManager.fillPasscode(passcode);

      await newDeviceUser.waitUntil(async () =>
        (await newDeviceUser.partyManager.getPartyNames()).length > 0
      );

      await newDeviceUser.waitUntil(async () =>
        !(await newDeviceUser.partyManager.getPartyNames()).includes('Loading...')
      );

      const partyNames = await newDeviceUser.partyManager.getPartyNames();
      expect(partyNames.includes(partyName)).toBeTruthy();

      await newDeviceUser.closeBrowser();
    });

    it.skip('Deactivate party on authorized device', async () => {});

    it('Recover seed phrase', async () => {
      const recoveredUser = new User('Recovered User');
      await recoveredUser.launchBrowser(browser, startUrl);

      expect(async () => await recoveredUser.recoverWallet(userA.seedPhrasePath)).not.toThrow();
      expect(await recoveredUser.getAccountName()).toEqual(userA.username);

      await recoveredUser.closeBrowser();
    });
  });
});
