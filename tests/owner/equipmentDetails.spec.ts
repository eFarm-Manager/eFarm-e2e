import { test, expect } from '@playwright/test';
import { restore_Equipment} from '../utils/dbCleanup'; 
import { configURL } from '../../config'; 
const ownerAuthFile = ".auth/owner.json";

test.use({ storageState: ownerAuthFile });
//make into 1 test when editing equipment starts working
//goto /equipment/1 -> edit -> change name -> save -> check if name changed -> delete -> check if deleted on /equipment
//after changes not deleting already existing one but the newly created one 

//potentially squish into 1 test equipmentList and equipmentDetails
export default function createTests() {
    test('Confirm that user can acess equipment detail', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment/1`);

        await expect(page.locator('p:has-text("Nazwa Sprzętu:")')).toBeVisible();
        await expect(page.locator('p:has-text("Kategoria:")')).toBeVisible();
        await expect(page.locator('p:has-text("Marka:")')).toBeVisible();
        await expect(page.locator('p:has-aby upewnić się, że system działa zgodnie z oczekiwaniami w rzeczywistych warunkach. Testy E2E symulują działania użytkownika i sprawdzają interakcje z różnymi komponentami aplikacji, w tym z bazą danych, interfejsem użytkownika i API.text("Model:")')).toBeVisible();
    });

    test('Verify that user can navigate back to the equipment list', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment/1`);

        await page.click('button:has-text("Powrót do listy sprzętu")');

        await expect(page).toHaveURL(`${configURL.baseURL}/equipment`);
    });

    test('Verify that user can delete the equipment', async ({ page }) => {
        await page.goto(`${configURL.baseURL}/equipment/1`);
        const equipmentName = await page.locator('p:has-text("Nazwa Sprzętu:")').textContent();
        const equipmentNameText = equipmentName ? equipmentName.replace('Nazwa Sprzętu: ', '') : '';

        page.on('dialog', async dialog => {
            if (dialog.type() === 'confirm') {
                await dialog.accept();
            }
        });
        await page.click('button:has-text("Usuń")');
        page.on('dialog', async dialog => {
            if (dialog.type() === 'alert') {
                await dialog.accept();
            }
        });

        await page.waitForURL(`${configURL.baseURL}/equipment`);

        const deletedItem = await page.locator(`td[data-label="Nazwa Sprzętu"]:has-text("${equipmentNameText}")`);
        await expect(deletedItem).not.toBeVisible();

        //db cleanup to original state
        await restore_Equipment(1,equipmentNameText);
    });

}