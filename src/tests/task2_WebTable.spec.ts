import { test } from "../test-fixtures/testFixtures";

test("Verify transaction with optional details", async ({ page,  webTablePage }) => {
    await webTablePage.goto();
    await webTablePage.verifyTableVisible();

    //#1
    await webTablePage.verifyTransaction("Templates Inc", {
        status: "Pending",
        date: "Jan 9th7:45pm",
        category: "Business",
        amount: "+ 340 USD"
    });

    //#2
    await webTablePage.verifyTransaction("Starbucks coffee", { status: "Complete" });
});