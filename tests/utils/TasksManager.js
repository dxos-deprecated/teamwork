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
    await this.page.waitForSelector(tasksSelector, { timeout: 2 * 1e3 });
    return !!(await this.page.$(tasksSelector));
  }

  async checkTask (taskName) {
    const checkboxSelector = `*css=.MuiListItem-root >> text="${taskName}" + .MuiListItemSecondaryAction-root >> input[type="checkbox"]`;
    await this.page.check(checkboxSelector);
  }

  async isTaskChecked (taskName) {

  }

  async deleteTask (taskName) {

  }
}
