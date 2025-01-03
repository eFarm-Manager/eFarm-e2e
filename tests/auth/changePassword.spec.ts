import { test, expect } from '@playwright/test';
import { configURL } from '../../config'; 

export default function createTests() {
    test('password change workflow', async ({ page }) => {
        const owner1Username = process.env.OWNER_USERNAME || 'defaultUsername';
        const owner1Password = process.env.OWNER_PASSWORD || 'defaultPassword';
        const newPassword = 'newPass321';
        
            // Log in with current password
            await page.goto(`${configURL.baseURL}/sign-in`);
            await page.fill('input[name="username"]', owner1Username);
            await page.fill('input[name="password"]', owner1Password);
            await page.click('button[type="submit"]');
            await page.waitForSelector('text=Witaj w panelu zarządzania,');
        
            // Navigate to the change password page
            await page.goto(`${configURL.baseURL}/change-password`);

            // Unsuccessful password change attempt #1
            await page.fill('input[name="currentPassword"]', owner1Password);
            await page.fill('input[name="newPassword"]', owner1Password);
            await page.fill('input[name="confirmNewPassword"]', owner1Password);
            await page.click('button[type="submit"]');
            await page.waitForSelector('text=Nowe hasło nie może być takie samo jak poprzednie');

            // Unsuccessful password change attempt #2
            await page.fill('input[name="currentPassword"]', newPassword);
            await page.fill('input[name="newPassword"]', owner1Password);
            await page.fill('input[name="confirmNewPassword"]', owner1Password);
            await page.click('button[type="submit"]');
            await page.waitForSelector('text=Podano nieprawidłowe aktualne hasło');
        
            // Change the password
            await page.fill('input[name="currentPassword"]', owner1Password);
            await page.fill('input[name="newPassword"]', newPassword);
            await page.fill('input[name="confirmNewPassword"]', newPassword);
            await page.click('button[type="submit"]');
        
            // Confirm the password change succeeded
            await page.waitForURL(`${configURL.baseURL}/dashboard`);
        
            // Log out
            await page.click('button:has-text("Wyloguj")');
        
            // Log in with the new password
            await page.goto(`${configURL.baseURL}/sign-in`);
            await page.fill('input[name="username"]', owner1Username);
            await page.fill('input[name="password"]', newPassword);
            await page.click('button[type="submit"]');
        
            // Verify login was successful again with the new password
            await page.waitForURL(`${configURL.baseURL}/dashboard`);
            await page.waitForSelector('text=Witaj w panelu zarządzania,');
        
        
            // Cleanup: Reset password back to original
            await page.goto(`${configURL.baseURL}/change-password`);
            await page.fill('input[name="currentPassword"]', newPassword);
            await page.fill('input[name="newPassword"]', owner1Password);
            await page.fill('input[name="confirmNewPassword"]', owner1Password);
            await page.click('button[type="submit"]');
        
    });
}
