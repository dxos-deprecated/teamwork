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
    await page.waitForSelector(selector, { timeout: 2 * 1e3 });
    return !!(await page.$(selector));
  } catch (error) {
    return false;
  }
};

export const isSelectorDeleted = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 2 * 1e3, state: 'detached' });
    return !(await page.$(selector));
  } catch (error) {
    return false;
  }
};

export const genericSelectors = {
  elementByClassSelector: (element, className) => `//${element}[contains(@class,"${className}")]`,
  elementByAttributeSelector: (element, attributeName, attributeValue) => `//${element}[${attributeName}="${attributeValue}"]`
};

export const selectors = {
  textButtonSelector: (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`,
  moreButtonSelector: genericSelectors.elementByAttributeSelector('button', '@aria-label', 'More'),
  settingsButtonSelector: genericSelectors.elementByAttributeSelector('button', '@aria-label', 'settings'),
  listItemSelector: (itemName) => `//li[.//*[text()="${itemName}"]]`,
  partyCardSelector: (partyIndex) => `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]`,
  checkboxSelector: genericSelectors.elementByClassSelector('span', 'Mui-checked'),
  dialogSelector: genericSelectors.elementByAttributeSelector('div', '@role', 'dialog')
};

export const textButtonSelector = (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`;
