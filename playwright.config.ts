import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    testDir: "./src/tests",
    timeout: 90 * 1000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 4 : undefined,
    retries: process.env.CI ? 2 : 1,

    reporter: [
        ["html", { outputFolder: "reports/html" }],
    ],

    use: {
        trace: "on-first-retry",
        headless: true,
        screenshot: "on",
        video: "retain-on-failure",
    },

    projects: [
        {
            name: "Google Chrome",
            use: {
                ...devices["Desktop Chrome"],
                channel: "chrome",
            },
        },
    ],
});
