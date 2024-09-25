import { test as setup, expect } from "@playwright/test";
import { configURL } from '../../config'; 

let owner1Username = process.env.OWNER_USERNAME;
let owner1Password = process.env.OWNER_PASSWORD;
const ownerAuthFile = ".auth/owner.json";

let manager1Username = process.env.MANAGER_USERNAME;
let manager1Password = process.env.MANAGER_PASSWORD;
const managerAuthFile = ".auth/manager.json";

let operator1Username = process.env.OPERATOR_USERNAME;
let operator1Password = process.env.OPERATOR_PASSWORD;
const operatorAuthFile = ".auth/operator.json";

if (!owner1Username || !owner1Password || !manager1Username || !manager1Password || !operator1Username || !operator1Password) {
    throw new Error("environment variables must be defined");
}
setup("Create Owner Auth", async ({ page, context }) => {
    await page.goto(`${configURL.baseURL}/sign-in`);
    
    await page.fill('input[name="username"]', owner1Username);
    await page.fill('input[name="password"]', owner1Password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`); 
    
    await context.storageState({ path: ownerAuthFile });
});

setup("Create Manager Auth", async ({ page, context }) => {
    await page.goto(`${configURL.baseURL}/sign-in`);
    
    await page.fill('input[name="username"]', manager1Username);
    await page.fill('input[name="password"]', manager1Password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`); 
    
    await context.storageState({ path: managerAuthFile });
});

setup("Create Operator Auth", async ({ page, context }) => {
    await page.goto(`${configURL.baseURL}/sign-in`);
    
    await page.fill('input[name="username"]', operator1Username);
    await page.fill('input[name="password"]', operator1Password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`); 
    
    await context.storageState({ path: operatorAuthFile });
});