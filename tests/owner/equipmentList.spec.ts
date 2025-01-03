import { test, expect } from '@playwright/test';
import { cleanup_User } from '../utils/dbCleanup'; 
import { configURL } from '../../config'; 
const ownerAuthFile = ".auth/owner.json";

test.use({ storageState: ownerAuthFile });
//make into 1 test when creating equipment starts working
//goto /equipment -> create new -> search bar that one -> click on it -> check if im in details of that one

//potentially squish into 1 test equipmentList and equipmentDetails
export default function createTests() {
    test('Confirm that user can acess equipment list', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment`);

        const equipmentList = await page.locator('table');
        await expect(equipmentList).toBeVisible();

        const firstItem = await equipmentList.locator('tbody tr').first();
        await expect(firstItem).toBeVisible();

        const firstItemName = await firstItem.locator('td[data-label="Nazwa Sprzętu"]').textContent();
        await expect(firstItemName).not.toBe('');
    });

    test('Verify that user can search for an equipment item', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment`);

        await page.fill('input[type="text"]', 'Sampo');

        const filteredRows = await page.locator('tbody tr');
        await expect(filteredRows).toHaveCount(1);
        const firstItemName = await filteredRows.first().locator('td[data-label="Nazwa Sprzętu"]').textContent();
        await expect(firstItemName).toBe('Sampo YM342A - 1');
    });

    test('Verify that clicking a record redirects to /equipment/id', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment`);

        const firstItem = await page.locator('tbody tr').first();
        await firstItem.click();

        await expect(page).toHaveURL(/\/equipment\/\d+/);
    });
}