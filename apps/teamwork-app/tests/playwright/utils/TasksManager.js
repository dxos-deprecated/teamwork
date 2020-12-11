//
// Copyright 2020 DXOS.org
//

import { isSelectorExisting, isSelectorDeleted } from './util';

export class TasksManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async addTask (taskName) {
    const addTaskButtonSelector = '.MuiListItemText-root + div >> button';
    await this.page.fill('input', taskName);
    await this.page.click(addTaskButtonSelector);
  }

  async checkTask (taskName) {
    const checkboxSelector = `//li[.//*[text()="${taskName}"]]//input[@type="checkbox"]`;
    if (this.isTaskUnchecked(taskName)) {
      await this.page.click(checkboxSelector);
    }
  }

  async uncheckTask (taskName) {
    const checkboxSelector = `//li[.//*[text()="${taskName}"]]//input[@type="checkbox"]`;
    if (this.isTaskChecked(taskName)) {
      await this.page.click(checkboxSelector);
    }
  }

  async deleteTask (taskName) {
    const deleteButtonSelector = `//li[.//*[text()="${taskName}"]]//button`;
    await this.isTaskExisting(taskName);
    await this.page.click(deleteButtonSelector);
  }

  async isTaskExisting (taskToFind) {
    const tasksSelector = `.MuiListItemText-root >> text=${taskToFind}`;
    return await isSelectorExisting(this.page, tasksSelector);
  }

  async isTaskDeleted (taskToFind) {
    const tasksSelector = `.MuiListItemText-root >> text=${taskToFind}`;
    return await isSelectorDeleted(this.page, tasksSelector);
  }

  async isTaskChecked (taskName) {
    const checkedCheckboxSelector = `//li[.//*[text()="${taskName}"]]//span[contains(@class,"Mui-checked")]`;
    return await isSelectorExisting(this.page, checkedCheckboxSelector);
  }

  async isTaskUnchecked (taskName) {
    const checkedCheckboxSelector = `//li[.//*[text()="${taskName}"]]//span[contains(@class,"Mui-checked")]`;
    return await isSelectorDeleted(this.page, checkedCheckboxSelector);
  }
}
