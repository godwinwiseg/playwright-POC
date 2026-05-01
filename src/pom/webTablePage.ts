import { expect, Locator, Page } from "@playwright/test";

export class WebTablePage {
    readonly page: Page;
    readonly table: Locator;
    readonly tableRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator("table.table");
        this.tableRows = this.table.locator("tbody tr");
    }

    async goto() {
        await this.page.goto(process.env.TASK2_URL!);
    }

    async verifyTableVisible() {
        await expect(this.table).toBeVisible();
    }

    // Get total number of rows
    async getRowCount(): Promise<number> {
        const rows = await this.tableRows.all();
        return rows.length;
    }

    async verifyTransaction(
        description: string,
        expected?: {
            status?: string;
            date?: string;
            category?: string;
            amount?: string;
        }
    ) {
        const rows = await this.tableRows.all();
        let found = false;

        for (const row of rows) {
            const desc = (await row.locator("td:nth-child(3)").textContent())?.trim();
            if (desc === description.trim()) {
                found = true;

                // Extract all columns
                const status = (await row.locator("td:nth-child(1)").textContent())?.trim();
                const date = (await row.locator("td:nth-child(2)").textContent())?.trim();
                const category = (await row.locator("td:nth-child(4)").textContent())?.trim();
                const amount = (await row.locator("td:nth-child(5)").textContent())?.trim();

                // Perform assertions only for fields provided
                if (expected?.status) expect(status).toBe(expected.status);
                if (expected?.date) expect(date).toBe(expected.date);
                if (expected?.category) expect(category).toBe(expected.category);
                if (expected?.amount) expect(amount).toBe(expected.amount);

                break;
            }
        }

        expect(found, `Transaction with description "${description}" not found`).toBeTruthy();
    }
}
