//
// Copyright 2020 DXOS.org
//

export class TasksManager {
  page = null;

  constructor (_page) {
    this.page = _page;
  }

  async addTask (taskName) {
    const addTaskButtonSelector = '.MuiListItemText-root + div >> button';
    this.page.fill('input', taskName);
    this.page.click(addTaskButtonSelector);
  }

  async isTaskExisting (taskToFind) {
    const tasksSelector = `.MuiListItemText-root >> text=${taskToFind}`;
    try {
      await this.page.waitForSelector(tasksSelector, { timeout: 2 * 1e3 });
      return !!(await this.page.$(tasksSelector));
    } catch {
      return false;
    }
  }

  async checkTask (taskName) {
    const checkboxSelector = `//li[.//*[text()="${taskName}"]]//input[@type="checkbox"]`;
    await this.page.check(checkboxSelector);
  }

  async uncheckTask (taskName) {
    const checkboxSelector = `//li[.//*[text()="${taskName}"]]//input[@type="checkbox"]`;
    await this.page.uncheck(checkboxSelector);
  }

  async isTaskChecked (taskName) {
    const checkedCheckboxSelector = `//li[.//*[text()="${taskName}"]]//span[contains(@class,"Mui-checked")]`;
    try {
      await this.page.waitForSelector(checkedCheckboxSelector, { timeout: 2 * 1e3 });
      return !!(await this.page.$(checkedCheckboxSelector));
    } catch {
      return false;
    }
  }

  async deleteTask (taskName) {

  }
}
