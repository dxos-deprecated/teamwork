//
// Copyright 2020 DXOS.org
//

import { genericSelectors, isSelectorExisting } from './shared';

const { classSelector, attributeSelector, containingSelector, parentClassSelector } = genericSelectors;

export class BoardManager {
  page = null;
  columnsSelector = `//div[@data-rbd-draggable-context-id and ${parentClassSelector('div', 'root')}]`;

  constructor (_page) {
    this.page = _page;
  }

  async addNewColumn () {
    const newColumnButtonSelector = '//div[./h5[text()="New List"]]/button';
    await this.page.click(newColumnButtonSelector);
  }

  async renameColumn (currentName, newName) {
    const columnIndex = await this.getColumnIndex(currentName);
    const columnSelector = `${this.columnsSelector}[${columnIndex + 1}]`;
    const inputSelector = columnSelector + '//input';
    await this.page.click(inputSelector);
    await this.page.fill(inputSelector, '');
    await this.page.fill(inputSelector, newName);
    await this.page.keyboard.press('Enter');
  }

  async getColumnsNames () {
    const inputsSelector = this.columnsSelector + '//input';
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
    const columnNameSelector = this.columnsSelector + attributeSelector('input', '@value', columnName);
    const isExisting = await isSelectorExisting(this.page, columnNameSelector);
    return isExisting;
  }

  async getColumnIndex (columnName) {
    return (await this.getColumnsNames()).indexOf(columnName);
  }
}
