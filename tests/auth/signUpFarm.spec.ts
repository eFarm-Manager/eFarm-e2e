import { test, expect } from '@playwright/test';
import { cleanupFarm_User_Code } from '../utils/dbCleanup'; 
import { configURL } from '../../config'; 
import { getUnusedActivationCode } from '../utils/userUtils'; 

export default function createTests() {
  test('Register User and Farm, and clean up', async ({ page }) => {
      const activationCode = await getUnusedActivationCode();  
      const newUser = {
          username: `testUser_${Date.now()}`, 
          password: 'testPass',
          activationCode: activationCode,
          firstName: 'testFirstName',
          lastName: 'testLastName',
          email: 'testEmail@gmail.com',
          phoneNumber: '',
          farmName: `testFarm_${Date.now()}`,
        };
      
      await page.goto(`${configURL.baseURL}/signup-farm`);
      await page.fill('input[name="firstName"]', newUser.firstName);
      await page.fill('input[name="lastName"]', newUser.lastName);
      await page.fill('input[name="username"]', newUser.username);
      await page.fill('input[name="email"]', newUser.email);
      await page.fill('input[name="password"]', newUser.password);
      await page.fill('input[name="phoneNumber"]', newUser.phoneNumber);
      await page.fill('input[name="farmName"]', newUser.farmName);
      await page.fill('input[name="activationCode"]', newUser.activationCode);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`); 
      
      await cleanupFarm_User_Code(newUser.username,activationCode,newUser.farmName);
  });
}