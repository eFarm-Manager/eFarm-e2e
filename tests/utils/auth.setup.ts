import { test as setup, expect, Page, BrowserContext } from "@playwright/test";
import fs from 'fs';
import { configURL } from '../../config'; 

let owner1Username = process.env.OWNER_USERNAME;
let owner1Password = process.env.OWNER_PASSWORD;
const ownerAuthFile = ".auth/owner.json";
const ownerSessionStorageFile = ".auth/ownerSessionStorage.json";

let manager1Username = process.env.MANAGER_USERNAME;
let manager1Password = process.env.MANAGER_PASSWORD;
const managerAuthFile = ".auth/manager.json";
const managerSessionStorageFile = ".auth/managerSessionStorage.json";

let operator1Username = process.env.OPERATOR_USERNAME;
let operator1Password = process.env.OPERATOR_PASSWORD;
const operatorAuthFile = ".auth/operator.json";
const operatorSessionStorageFile = ".auth/operatorSessionStorage.json";

if (!owner1Username || !owner1Password || !manager1Username || !manager1Password || !operator1Username || !operator1Password) {
    throw new Error("environment variables must be defined");
}

interface AuthResponse {
    username: string;
    roles: string[];
    expireCodeInfo: any;
}

async function createAuth(page: Page, context: BrowserContext, usernameLogin: string, passwordLogin: string, authFile: string, sessionStorageFile: string): Promise<void> {
    await page.goto(`${configURL.baseURL}/sign-in`);
    
    await page.fill('input[name="username"]', usernameLogin);
    await page.fill('input[name="password"]', passwordLogin);
    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/auth') && response.status() === 200),
        page.click('button[type="submit"]')
    ]);

    const responseData: AuthResponse = await response.json();
    const { username, roles, expireCodeInfo } = responseData;
    
    await expect(page).toHaveURL(`${configURL.baseURL}/dashboard`);
    
    const storageState = await context.storageState({path: authFile});

    fs.mkdirSync('.auth', { recursive: true });
    fs.writeFileSync(sessionStorageFile, JSON.stringify({
        username,
        roles,
        expireCodeInfo
    }, null, 2));
}

setup("Create Owner Auth", async ({ page, context }) => {
    await createAuth(page, context, owner1Username, owner1Password, ownerAuthFile, ownerSessionStorageFile);
});

setup("Create Manager Auth", async ({ page, context }) => {
    await createAuth(page, context, manager1Username, manager1Password, managerAuthFile, managerSessionStorageFile);
});

setup("Create Operator Auth", async ({ page, context }) => {
    await createAuth(page, context, operator1Username, operator1Password, operatorAuthFile, operatorSessionStorageFile);
});