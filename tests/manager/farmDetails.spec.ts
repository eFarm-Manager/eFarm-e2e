import { test, expect } from '@playwright/test';
import { getNotActiveFarm } from '../utils/userUtils'; 
import { configURL } from '../../config'; 
const managerAuthFile = ".auth/manager.json";

test.use({ storageState: managerAuthFile });

//TODO buttons will be in polish not english like rn
export default function createTests() {
    test('Owner can edit farm details, cancel changes, and verify save', async ({ page }) => {
        const farmName = await getNotActiveFarm();
        // Navigate to the farm-details page and check that categories exist
        await page.goto(`${configURL.baseURL}/farm-details`);
        
        // Verify that categories exist (check for labels in view mode)
        await expect(page.locator('p:has-text("Farm Name:")')).toBeVisible();
        await expect(page.locator('p:has-text("Farm Number:")')).toBeVisible();
        await expect(page.locator('p:has-text("Feed Number:")')).toBeVisible();
        await expect(page.locator('p:has-text("Sanitary Register Number:")')).toBeVisible();
        await expect(page.locator('p:has-text("Street:")')).toBeVisible();
        await expect(page.locator('p:has-text("Building Number:")')).toBeVisible();
        await expect(page.locator('p:has-text("ZIP Code:")')).toBeVisible();
        await expect(page.locator('p:has-text("City:")')).toBeVisible();
        
        // Capture initial values from view mode (before editing)
        const initialFarmNameElement = await page.locator('p:has-text("Farm Name:")').textContent();
        const initialFarmName = initialFarmNameElement ? initialFarmNameElement.replace('Farm Name: ', '').trim() : '';
        
        const initialFarmNumberElement = await page.locator('p:has-text("Farm Number:")').textContent();
        const initialFarmNumber = initialFarmNumberElement ? initialFarmNumberElement.replace('Farm Number: ', '').trim() : '';
        
        const initialFeedNumberElement = await page.locator('p:has-text("Feed Number:")').textContent();
        const initialFeedNumber = initialFeedNumberElement ? initialFeedNumberElement.replace('Feed Number: ', '').trim() : '';

        // Click the Edit button to enter edit mode
        await page.click('button:has-text("Edit Farm Details")');
        
        // Verify that the form is now editable (check that form fields are populated)
        if (initialFarmName !== null) {
            await expect(page.locator('input[name="farmName"]')).toHaveValue(initialFarmName.trim());
        }
        if (initialFarmNumber !== null) {
            await expect(page.locator('input[name="farmNumber"]')).toHaveValue(initialFarmNumber.trim());
        }
        if (initialFeedNumber !== null) {
            await expect(page.locator('input[name="feedNumber"]')).toHaveValue(initialFeedNumber.trim());
        }

        
        // Click Cancel to cancel the editing
        await page.click('button:has-text("Cancel")');
        
        // Verify that the form is no longer visible (we're back to view mode)
        await expect(page.locator('input[name="farmName"]')).toHaveCount(0);  
        await expect(page.locator('button:has-text("Edit Farm Details")')).toBeVisible();  
        
        // Click Edit again to edit values
        await page.click('button:has-text("Edit Farm Details")');
        
        // Verify that you cant make farm name same as existing one
        // TODO: Add this test when it's implemented
        /*
        await page.fill('input[name="farmName"]', farmName);

        await page.click('button[type="submit"]');
        await page.waitForSelector('text=Nowe hasło nie może być takie samo jak poprzednie');
        */
        // Modify values (change farmName and farmNumber as an example)
        const newFarmName = 'UpdatedFarmName';
        const newFarmNumber = '98765';
        await page.fill('input[name="farmName"]', newFarmName);
        await page.fill('input[name="farmNumber"]', newFarmNumber);
        
        // Save the changes
        await page.click('button[type="submit"]');
        
        // Verify that the changes have been saved and are reflected in view mode
        await expect(page.locator('p:has-text("Farm Name:")')).toContainText(newFarmName);
        await expect(page.locator('p:has-text("Farm Number:")')).toContainText(newFarmNumber);
        
        await page.reload();
        await expect(page.locator('p:has-text("Farm Name:")')).toContainText(newFarmName);
        await expect(page.locator('p:has-text("Farm Number:")')).toContainText(newFarmNumber);
        
        // Cleanup - restore original values
        await page.click('button:has-text("Edit Farm Details")');
        if (initialFarmName !== null) {
            await page.fill('input[name="farmName"]', initialFarmName.trim());
        }
        if (initialFarmNumber !== null) {
            await page.fill('input[name="farmNumber"]', initialFarmNumber.trim());
        }
        await page.click('button[type="submit"]');
        
        // Verify that the original values are restored
        if(initialFarmName !== null && initialFarmNumber !== null) {
        await expect(page.locator('p:has-text("Farm Name:")')).toContainText(initialFarmName);
        await expect(page.locator('p:has-text("Farm Number:")')).toContainText(initialFarmNumber);
        }
        
    });
    
    
}