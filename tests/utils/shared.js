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
  } catch {
    return false;
  }
};

export const isSelectorDeleted = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 2 * 1e3, state: 'detached' });
    return !(await page.$(selector));
  } catch {
    return false;
  }
};

export const selectors = {
  textButtonSelector: (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`,
  moreButtonSelector: '//button[contains(@aria-label,\'More\')]',
  listItemSelector: (itemName) => `//li[.//*[text()="${itemName}"]]`,
  partyCardSelector: (partyIndex) => `//div[contains(@class,'MuiGrid-item')][${partyIndex + 1}]`,
  checkboxSelector: '//span[contains(@class,"Mui-checked")]',
  dialogSelector: '//div[@role="dialog"]'
};

export const textButtonSelector = (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`;
