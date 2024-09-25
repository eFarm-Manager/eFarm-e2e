import { test, expect } from '@playwright/test';
import { cleanup_User } from '../utils/dbCleanup'; 
import { configURL } from '../../config'; 
const ownerAuthFile = ".auth/owner.json";

test.use({ storageState: ownerAuthFile });

export default function createTests() {
    test('Register User inside farm, and clean up', async ({ page }) => {
        const newUser = {
          username: `testUser_${Date.now()}`, 
          password: 'testPass',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          email: 'testEmail@gmail.com',
          phoneNumber: '',
          role: 'ROLE_FARM_EQUIPMENT_OPERATOR'
        };

        await page.goto(`${configURL.baseURL}/signup-user`);

        await page.fill('input[name="firstName"]', newUser.firstName);
        await page.fill('input[name="lastName"]', newUser.lastName);
        await page.fill('input[name="username"]', newUser.username);
        await page.fill('input[name="email"]', newUser.email);
        await page.fill('input[name="password"]', newUser.password);
        await page.fill('input[name="phoneNumber"]', newUser.phoneNumber);

        await page.selectOption('select[name="role"]', newUser.role);

        await page.click('button[type="submit"]');

        const responseMessage = page.locator('p'); 

        await expect(responseMessage).toBeVisible();        
        await expect(responseMessage).toContainText('User registration successful!');

        await cleanup_User(newUser.username);
  });
}