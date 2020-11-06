//
// Copyright 2020 DXOS.org
//

import { isSelectorExisting, isSelectorDeleted, selectors, waitUntil } from './shared';

const {
    textButtonSelector,
    partyCardSelector,
    listItemSelector,
    moreButtonSelector,
    dialogSelector,
    settingsButtonSelector
} = selectors;

export class PartyManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async createParty () {
    const cardsSelector = '//div[contains(@class,\'MuiGrid-item\')]';
    const cardTitlesSelector = '//div[contains(@class,\'MuiGrid-item\')]//h2';
    await this.page.waitForSelector(cardsSelector);
    const initialPartyNames = await this.getPartyNames();

    const newPartyButtonSelector = '(//button[@name=\'new-party\'])[1]';
    await this.page.waitForSelector(newPartyButtonSelector);
    await this.page.click(newPartyButtonSelector);

    while (initialPartyNames.length === (await this.page.$$(cardTitlesSelector)).length) {
        await this.page.waitForTimeout(50);
    }

    const currentPartyNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));
    const newCardName = currentPartyNames.filter(card => !initialPartyNames.includes(card))[0];

    return newCardName;
  }

  async clickSharePartyButton (partyIdx) {
    const shareButtonSelector = `(//div[@name='share'])[${partyIdx}]`;
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

    const shareLink = { url: null };
    await this.subscribeForLink(shareLink);
    await this.page.click(inviteUserButtonSelector);

    const copyButtonSelector = '//button[contains(@title,\'Copy to clipboard\')]';
    await this.page.waitForSelector(copyButtonSelector);
    await this.page.click(copyButtonSelector);

    await waitUntil(this.page, () => !!shareLink.url);

    return shareLink.url;
  }

  async inviteKnownUserToParty (partyName, userName) {
    await this.shareParty(partyName);
    const addUserButtonSelector = `//*[contains(@class,'MuiDialog-container')]//td[text()='${userName}']/following::*[contains(@class,'MuiIconButton-label')]`;
    await this.page.waitForSelector(addUserButtonSelector);

    const shareLink = { url: null };
    await this.subscribeForLink(shareLink);
    await this.page.click(addUserButtonSelector);
    await waitUntil(this.page, () => !!shareLink.url);

    return shareLink.url;
  }

  async shareParty (partyName) {
    const cardsSelector = '//div[contains(@class,\'MuiGrid-item\')]';
    const cardTitlesSelector = '//div[contains(@class,\'MuiGrid-item\')]//h2';
    await this.page.waitForSelector(cardsSelector);
    const initialCardNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));

    const partyIdx = initialCardNames.findIndex(cardName => cardName === partyName) + 1;
    await this.clickSharePartyButton(partyIdx);
  }

  async subscribeForLink (shareLink) {
    const linkRegex = /==$/g;

    this.page.waitForEvent('console', message => {
        if (message.text().match(linkRegex)) {
            shareLink.url = message.text();
            return true;
        }
        return false;
    });
  }

  async getPasscode () {
    const passcodeSelector = '//span[contains(@class,\'passcode\')]';
    await this.page.waitForSelector(passcodeSelector, { timeout: 60 * 1e3 });
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
    const partyNameSelector = `//*[contains(text(),'${partyName}')]`;
    try {
        await this.page.waitForSelector(partyNameSelector, { timeout: 1e5 });
    } catch (error) {
        console.log('Party: ' + partyName + ' does not exist');
        return false;
    }
    return true;
  }

  async isUserInParty (partyName, username) {
    if (!(await this.isPartyExisting(partyName))) {
        return false;
    }
    const avatarGroupSelector = '//div[contains(@class,\'MuiAvatarGroup-root\')]';
    const userAvatarSelector = `${avatarGroupSelector}/*[@title='${username}']`;

    return isSelectorExisting(userAvatarSelector);
    // try {
    //     await this.page.waitForSelector(userAvatarSelector, { timeout: 1e5 });
    // } catch (error) {
    //     console.log('User: ' + username + ' does not exist in party: ' + partyName);
    //     return false;
    // }
    // return await this.page.$eval(userAvatarSelector, avatar => !!avatar);
  }

  async getPartyNames () {
    const partyNamesSelector = '//div[contains(@class,\'MuiGrid-item\')]//*[contains(@class,\'MuiCardHeader-content\')]/*';
    try {
        await this.page.waitForSelector(partyNamesSelector, { timeout: 2 * 1e3 });
    } catch (error) {
        console.log(`${this.username} did not select any party name tag`);
        return [];
    }
    try {
        const partyNames = await this.page.$$eval(partyNamesSelector, partyNamesTags => {
            return partyNamesTags.map(tag => tag.innerHTML);
        });
        return partyNames;
    } catch (error) {
        console.log(`${this.username} did not select any party name`);
        return null;
    }
  }

  async getPartyIndex (partyName) {
    return (await this.getPartyNames()).indexOf(partyName);
  }

  async redeemParty (sharelink) {
    const headerMoreButtonSelector = '//header//button[contains(@aria-label,\'More\')]';
    await this.page.click(headerMoreButtonSelector);

    const redeemPartySelector = '//li[text()=\'Redeem invitation\']';
    await this.page.click(redeemPartySelector);
    await this.page.fill('textarea', sharelink);

    const sendButtonSelector = textButtonSelector('Submit');
    await this.page.click(sendButtonSelector);
  }

  async addItemToParty (partyName, itemType, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const addItemButtonSelector = `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]//button[contains(@aria-label, 'add item')]`;
    await this.page.click(addItemButtonSelector);

    const listItemSelector = `//*[contains(@class,'MuiPopover-paper')]//*[contains(@class, 'MuiListItem-button')]//*[text()='${itemType}']`;
    await this.page.click(listItemSelector);

    await this.page.click('input');
    await this.page.fill('input', itemName);
    await this.page.click(textButtonSelector('Done'));
  }

  async enterItemInParty (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const listItemSelector = `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]//*[contains(@class, 'MuiListItem-button')]//*[text()='${itemName}']`;
    await this.page.click(listItemSelector);
  }

  async archiveItemInParty (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const deleteItemButtonSelector = `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]//li[.//*[text()="${itemName}"]]//button`;
    await this.page.click(deleteItemButtonSelector);
  }

  async isItemDeleted (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const listItemSelector = `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]//*[contains(@class, 'MuiListItem-button')]//*[text()='${itemName}']`;
    return await isSelectorDeleted(this.page, listItemSelector);
  }

  async isItemExisting (partyName, itemName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const listItemSelector = `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]//*[contains(@class, 'MuiListItem-button')]//*[text()='${itemName}']`;
    return await isSelectorExisting(this.page, listItemSelector);
  }

  async showArchivedItems (partyName) {
    const partyIndex = await this.getPartyIndex(partyName);
    const moreOptionsButtonSelector = partyCardSelector(partyIndex) + settingsButtonSelector;
    await this.page.click(moreOptionsButtonSelector);
    const showDeletedItemsLabelSelector = dialogSelector + '//label[.//span[text()="Show deleted items"]]';
    await this.page.click(showDeletedItemsLabelSelector);
    await this.page.click(textButtonSelector('Done'));
  }
}
