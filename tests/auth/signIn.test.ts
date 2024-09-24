import { test, expect } from '@playwright/test';
import { cleanupFarm_User_Code } from '../utils/dbCleanup'; 
import { configURL } from '../../config'; 
import { createUserFarm } from '../utils/userUtils';
import { createUnusedActivationCode } from '../utils/userUtils'; 
import { createUniqueActivationCode } from '../utils/userUtils';

test('Create a user, log in, and clean up', async ({ page }) => {
    const activationCode = await createUniqueActivationCode();
    await createUnusedActivationCode(activationCode); 
    const newUser = await createUserFarm(activationCode);   

    await page.goto(`${configURL.baseURL}/sign-in`);
    await page.fill('input[name="username"]', newUser.username);
    await page.fill('input[name="password"]', newUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`); 

    await cleanupFarm_User_Code(newUser.username,activationCode,newUser.farmName);
});

test('Invalid log in credentials', async ({page}) => {
    await page.goto(`${configURL.baseURL}/sign-in`);
    await page.fill('input[name="username"]', "invalidLogin");
    await page.fill('input[name="password"]', "invalidPassword");
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('p'); 

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid login credentials.');
});
