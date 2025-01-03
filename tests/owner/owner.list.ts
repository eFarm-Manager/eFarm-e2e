import {test} from '@playwright/test'
import fs from 'fs';
import { configURL } from '../../config';
const ownerSessionStorageFile = ".auth/ownerSessionStorage.json";
import signUpUserTests from './signUpUser.spec'
import equipmentListTests from './equipmentList.spec'
import equipmentDetailsTests from './equipmentDetails.spec'
import farmDetailsTests from './farmDetails.spec'

test.beforeEach(async ({ page, context }) => {
    const sessionData = JSON.parse(fs.readFileSync(ownerSessionStorageFile, 'utf-8'));
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

test.describe(signUpUserTests)
test.describe(equipmentListTests)
test.describe(equipmentDetailsTests)
test.describe(farmDetailsTests)