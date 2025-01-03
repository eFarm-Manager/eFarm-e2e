import { defineConfig } from "playwright/test";

require("dotenv").config();

export default defineConfig({
    workers:2,
    testMatch: '*.list.ts',
    projects: [
        { name: "setup", testMatch: /.*\.setup\.ts/, fullyParallel: true },
        {name: 'auth', testMatch: 'auth.list.ts'},
        {name: 'owner', testMatch: 'owner.list.ts'},
        {name: 'manager', testMatch: 'manager.list.ts'},
    //    {name: 'operator', testMatch: 'operator.list.ts'},
    ],
    reporter: [["list"]]
})