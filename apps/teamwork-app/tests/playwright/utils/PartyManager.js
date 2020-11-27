//
// Copyright 2020 DXOS.org
//

import { isSelectorExisting, isSelectorDeleted, selectors, genericSelectors, waitUntil } from './util';

const {
  cardsSelector,
  textButtonSelector,
  partyCardSelector,
  dialogSelector,
  listItemSelector
} = selectors;

const { attributeSelector, classSelector } = genericSelectors;

export class PartyManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async createParty () {
    const cardsSelector = classSelector('div', 'MuiGrid-item');
    await this.page.waitForSelector(cardsSelector);
    const initialPartyNames = await this.getPartyNames();

    const newPartyButtonSelector = '(//button[@name=\'new-party\'])[1]';
    await this.page.waitForSelector(newPartyButtonSelector);
    await this.page.click(newPartyButtonSelector);

    const cardTitlesSelector = cardsSelector + '//h2';
    while (initialPartyNames.length === (await this.page.$$(cardTitlesSelector)).length) {
      await this.page.waitForTimeout(50);
    }

    const currentPartyNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));
    const newCardName = currentPartyNames.filter(card => !initialPartyNames.includes(card))[0];

    return newCardName;
  }

  async renameParty (currentName, newName) {
    const partyIndex = await this.getPartyIndex(currentName);
    const settingsButtonSelector = partyCardSelector(partyIndex) + attributeSelector('button', '@aria-label', 'settings');
    await this.page.click(settingsButtonSelector);

    const inputSelector = dialogSelector + attributeSelector('input', '@type', 'text');
    await this.page.click(inputSelector, { clickCount: 2 });
    await this.page.fill(inputSelector, newName);
    await this.page.click(textButtonSelector('Done'));
  }

  async clickSharePartyButton (partyIdx) {
    const shareButtonSelector = `(${attributeSelector('div', '@name', 'share')})[${partyIdx}]`;
    await this.page.waitForSelector(shareButtonSelector);
    await this.page.click(shareButtonSelector);
  }

  async closeSharePartyDialog () {
    const doneButtonSelector = textButtonSelector('Done');
    await this.page.waitForSelector(doneButtonSelector);
    await this.page.click(doneButtonSelector);
  }

  async inviteUnknownUserToParty (partyIdx) {
    await this.clickSharePartyButton(partyIdx);

    const inviteUserButtonSelector = textButtonSelector('Invite User');
    await this.page.waitForSelector(inviteUserButtonSelector);

    const invitation = { key: null };
    await this.subscribeForLink(invitation);
    await this.page.click(inviteUserButtonSelector);

    const copyButtonSelector = attributeSelector('button', '@title', 'Copy to clipboard');
    await this.page.waitForSelector(copyButtonSelector);
    await this.page.click(copyButtonSelector);

    await waitUntil(this.page, () => !!invitation.key);

    return invitation.key;
  }

  async inviteKnownUserToParty (partyName, userName) {
    await this.shareParty(partyName);
    const addUserButtonSelector = classSelector('div', 'MuiDialog-container') + attributeSelector('td', 'text()', userName) + '/following::*[contains(@class,"MuiIconButton-label")]';
    await this.page.waitForSelector(addUserButtonSelector);

    const invitation = { key: null };
    await this.subscribeForLink(invitation);

    await this.page.click(addUserButtonSelector);
    const copyButtonSelector = attributeSelector('button', '@title', 'Copy to clipboard');
    await this.page.waitForSelector(copyButtonSelector);
    await this.page.click(copyButtonSelector);

    await waitUntil(this.page, () => !!invitation.key);

    return invitation.key;
  }

  async shareParty (partyName) {
    const cardsSelector = classSelector('div', 'MuiGrid-item');
    const cardTitlesSelector = cardsSelector + '//h2';
    await this.page.waitForSelector(cardsSelector);
    const initialCardNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));

    const partyIdx = initialCardNames.findIndex(cardName => cardName === partyName) + 1;
    await this.clickSharePartyButton(partyIdx);
  }

  async subscribeForLink (invitation) {
    const linkRegex = /==$/g;

    this.page.waitForEvent('console', message => {
      if (message.text().match(linkRegex)) {
        invitation.key = message.text();
        return true;
      }
      return false;
    });
  }

  async getPasscode () {
    const passcodeSelector = classSelector('span', 'passcode');
    await this.page.waitForSelector(passcodeSelector, { timeout: 60000 });
    return await this.page.$eval(passcodeSelector, passcode => passcode.innerHTML);
  }

  async fillPasscode (passcode) {
    await this.page.waitForSelector('input');
    await this.page.fill('input', passcode);
    const sendButtonSelector = textButtonSelector('Submit');
    await this.page.waitForSelector(sendButtonSelector);
    await this.page.click(sendButtonSelector);
  }

  async isPartyExisting (partyName) {
    const partyNameSelector = cardsSelector + classSelector('div', 'MuiCardHeader-content') + attributeSelector('h2', 'text()', partyName);
    return await isSelectorExisting(partyNameSelector);
  }

  async isUserInParty (partyName, username) {
    if (!(await this.isPartyExisting(partyName))) {
      return false;
    }
    const avatarGroupSelector = classSelector('div', 'MuiAvatarGroup-root');
    const userAvatarSelector = `${avatarGroupSelector}/*[@title='${username}']`;

    return isSelectorExisting(userAvatarSelector);
  }

  async getPartyNames () {
    const partyNamesSelector = cardsSelector + classSelector('div', 'MuiCardHeader-content') + '/h2';
    if (!isSelectorExisting(partyNamesSelector)) {
      return [];
    }
    try {
      return await this.page.$$eval(partyNamesSelector, partyNamesTags => {
        return partyNamesTags.map(tag => tag.innerHTML);
      });
    } catch (error) {
      console.log(`${this.username} did not select any party name`);
      return [];
    }
  }

  async getPartyIndex (partyName) {
    return (await this.getPartyNames()).indexOf(partyName);
  }

  async redeemParty (invitation) {
    const headerMoreButtonSelector = '//header' + attributeSelector('button', '@aria-label', 'More');
    await this.page.click(headerMoreButtonSelector);

    const redeemPartySelector = attributeSelector('li', 'text()', 'Redeem invitation');
    await this.page.click(redeemPartySelector);
    await this.page.fill('textarea', invitation);

    const sendButtonSelector = textButtonSelector('Submit');
    await this.page.click(sendButtonSelector);
  }

  async redeemPartyOffline (invitation) {
    const headerMoreButtonSelector = '//header' + attributeSelector('button', '@aria-label', 'More');
    await this.page.click(headerMoreButtonSelector);

    const redeemPartySelector = attributeSelector('li', 'text()', 'Redeem invitation');
    await this.page.click(redeemPartySelector);

    const offlineCheckboxSelector = dialogSelector + '//input[@type="checkbox"]';
    await this.page.click(offlineCheckboxSelector);
    await this.page.fill('textarea', invitation);

    const sendButtonSelector = textButtonSelector('Submit');
    await this.page.click(sendButtonSelector);
  }

  async addItemToParty (partyName, itemType, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const addItemButtonSelector = partyCardSelector(partyIndex) + attributeSelector('button', '@aria-label', 'add item');
    await this.page.click(addItemButtonSelector);

    const itemSelector = classSelector('div', 'MuiPopover-paper') + listItemSelector(itemType);
    await this.page.click(itemSelector);

    await this.page.click('input');
    await this.page.fill('input', itemName);
    await this.page.click(textButtonSelector('Done'));
  }

  async enterItemInParty (partyName, itemName) {
    await waitUntil(this.page, async () => (await this.getPartyIndex(partyName) !== -1));
    const partyIndex = await this.getPartyIndex(partyName);
    const itemSelector = partyCardSelector(partyIndex) + listItemSelector(itemName);
    await this.page.click(itemSelector);
  }

  async archiveItemInParty (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const deleteItemButtonSelector = partyCardSelector(partyIndex) + listItemSelector(itemName) + '//button';
    await this.page.click(deleteItemButtonSelector);
  }

  async restoreItemInParty (partyName, itemName) {
    this.archiveItemInParty(partyName, itemName);
  }

  async isItemDeleted (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const itemSelector = partyCardSelector(partyIndex) + listItemSelector(itemName);
    return await isSelectorDeleted(this.page, itemSelector);
  }

  async isItemExisting (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const itemSelector = partyCardSelector(partyIndex) + listItemSelector(itemName);
    return await isSelectorExisting(this.page, itemSelector);
  }

  async showArchivedItems (partyName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const settingsButtonSelector = partyCardSelector(partyIndex) + attributeSelector('button', '@aria-label', 'settings');
    await this.page.click(settingsButtonSelector);
    const showDeletedItemsLabelSelector = dialogSelector + '//label[.//span[text()="Show deleted items"]]';
    await this.page.click(showDeletedItemsLabelSelector);
    await this.page.click(textButtonSelector('Done'));
  }

  async getItemsNames (partyName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const itemsSelector = partyCardSelector(partyIndex) + '//li' + classSelector('span', 'MuiTypography');
    return await this.page.$$eval(itemsSelector, items => items.map(item => item.innerHTML));
  }
}
