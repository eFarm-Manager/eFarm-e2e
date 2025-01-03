import {test} from '@playwright/test'
import fs from 'fs';
import { configURL } from '../../config';
const managerSessionStorageFile = ".auth/managerSessionStorage.json";
import farmDetailsTests from './farmDetails.spec'

test.beforeEach(async ({ page, context }) => {
    const sessionData = JSON.parse(fs.readFileSync(managerSessionStorageFile, 'utf-8'));
    await page.goto(configURL.baseURL);
    const promises = Object.entries(sessionData).map(async ([key, value]) => {
      if (key === 'username' || key === 'roles' || key === 'expireCodeInfo') {
        return await page.evaluate(({ key, value }) => {
          window.sessionStorage.setItem(key, JSON.stringify(value)); 
        }, { key, value });
      }
    });
  
    await Promise.all(promises);
  });

test.describe(farmDetailsTests)