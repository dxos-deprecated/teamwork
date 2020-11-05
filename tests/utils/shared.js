//
// Copyright 2020 DXOS.org
//

export const waitUntil = async (page, predicate) => {
  while (!(await predicate())) {
      await page.waitForTimeout(50);
  }
};

export const textButtonSelector = (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`;
