//
// Copyright 2020 DXOS.org
//

import { genericSelectors, isSelectorDeleted, isSelectorExisting, selectors } from './util';

const { classSelector, attributeSelector, containingSelector, parentClassSelector } = genericSelectors;
const { dialogSelector, textButtonSelector, listItemSelector } = selectors;
const columnsSelector = `//div[@data-rbd-draggable-context-id and ${parentClassSelector('div', 'root')}]`;

export class BoardManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async _isSelectorExisting (selector) {
    return await isSelectorExisting(this.page, selector);
  }

  async _isSelectorDeleted (selector) {
    return await isSelectorDeleted(this.page, selector);
  }

  async addNewColumn () {
    const newColumnButtonSelector = '//div[./h5[text()="New List"]]/button';
    await this.page.click(newColumnButtonSelector);
  }

  async renameColumn (currentName, newName) {
    const columnIndex = await this.getColumnIndex(currentName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const inputSelector = columnSelector + '//input';
    await this.page.click(inputSelector);
    await this.page.fill(inputSelector, '');
    await this.page.fill(inputSelector, newName);
    await this.page.keyboard.press('Enter');
  }

  async getColumnsNames () {
    const inputsSelector = columnsSelector + '//input';
    if (!isSelectorExisting(inputsSelector)) {
      return [];
    }
    try {
      return await this.page.$$eval(inputsSelector, inputs => {
        return inputs.map(input => input.getAttribute('value'));
      });
    } catch (error) {
      console.log(`${this.username} did not select any column name`);
      return [];
    }
  }

  async isColumnExisting (columnName) {
    const columnNameSelector = columnsSelector + attributeSelector('input', '@value', columnName);
    const isExisting = await isSelectorExisting(this.page, columnNameSelector);
    return isExisting;
  }

  async getColumnIndex (columnName) {
    return (await this.getColumnsNames()).indexOf(columnName);
  }

  async addCardInColumn (itemName, columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const addCardButtonSelector =
      columnSelector +
      containingSelector('button', attributeSelector('span', 'text()', 'Add another card'));
    await this.page.click(addCardButtonSelector);
    const newCardSelector = columnSelector + classSelector('div', 'MuiPaper-root');
    await this.page.fill(newCardSelector + '//input', itemName);
    const submitButtonSelector =
      newCardSelector +
      containingSelector('button', attributeSelector('span', 'text()', 'Add'));
    await this.page.click(submitButtonSelector);
  }

  async archiveCard (cardName, columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const cardSelector = columnSelector + `//div[contains(@class, MuiPaper-root) and contains(.//p, "${cardName}") and @data-rbd-draggable-context-id]`;
    await this.page.click(cardSelector);
    const archiveButtonSelector = dialogSelector + textButtonSelector('Archive');
    await this.page.click(archiveButtonSelector);
  }

  async restoreCard (cardName, columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const cardSelector = columnSelector + `//div[contains(@class, MuiPaper-root) and contains(.//p, "${cardName}") and @data-rbd-draggable-context-id]`;
    await this.page.click(cardSelector);
    const restoreButtonSelector = dialogSelector + textButtonSelector('Restore');
    await this.page.click(restoreButtonSelector);
  }

  async showArchivedCards (columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const settingsButtonSelector = columnSelector + attributeSelector('button', '@aria-label', 'settings');
    await this.page.click(settingsButtonSelector);
    const itemSelector = classSelector('div', 'MuiPopover-paper') + listItemSelector('Show archived');
    await this.page.click(itemSelector);
  }

  async isCardExisting (cardName, columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const cardNameSelector = columnSelector + classSelector('div', 'MuiPaper-root') + attributeSelector('p', 'text()', cardName);
    return await this._isSelectorExisting(cardNameSelector);
  }

  async isCardDeleted (cardName, columnName) {
    const columnIndex = await this.getColumnIndex(columnName);
    const columnSelector = `${columnsSelector}[${columnIndex + 1}]`;
    const cardNameSelector = columnSelector + classSelector('div', 'MuiPaper-root') + attributeSelector('p', 'text()', cardName);
    return await this._isSelectorDeleted(cardNameSelector);
  }
}
