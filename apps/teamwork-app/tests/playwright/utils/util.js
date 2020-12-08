//
// Copyright 2020 DXOS.org
//

export const waitUntil = async (page, predicate) => {
  while (!(await predicate())) {
    await page.waitForTimeout(50);
  }
};

export const isSelectorExisting = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    return !!(await page.$(selector));
  } catch (error) {
    return false;
  }
};

export const isSelectorDeleted = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 5000, state: 'detached' });
    return !(await page.$(selector));
  } catch (error) {
    return false;
  }
};

export const genericSelectors = {
  classSelector: (element, className) => `//${element}[contains(@class,"${className}")]`,
  parentClassSelector: (element, className) => `parent::${element}[contains(@class,"${className}")]`,
  attributeSelector: (element, attributeName, attributeValue) => `//${element}[${attributeName}="${attributeValue}"]`,
  containingSelector: (element, content) => `//${element}[.${content}]`
};

export const selectors = {
  textButtonSelector: (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`,
  listItemSelector: (itemName) => `//li[.//*[text()="${itemName}"]]`,
  partyCardSelector: (partyIndex) => `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]`,
  cardsSelector: genericSelectors.classSelector('div', 'MuiGrid-item'),
  checkboxSelector: genericSelectors.classSelector('span', 'Mui-checked'),
  dialogSelector: genericSelectors.attributeSelector('div', '@role', 'dialog')
};
