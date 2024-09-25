import { defineConfig } from "playwright/test";

require("dotenv").config();

export default defineConfig({
    workers:2,
    testMatch: '*.list.ts',
    projects: [
        { name: "setup", testMatch: /.*\.setup\.ts/, fullyParallel: true },
        {name: 'auth', testMatch: 'auth.list.ts'},
        {name: 'test2', testMatch: 'test2.list.ts'}
    ],
    reporter: [["html"], ["list"]]
})