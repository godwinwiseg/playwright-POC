import { Page, Locator, expect } from "@playwright/test";

export class OrderDetailsPage {
    readonly ordersLink: Locator;
    readonly orderRows: Locator;

    readonly orderNumber: Locator;
    readonly orderTotal: Locator;
    readonly quantity: Locator;

    constructor(private page: Page) {
        this.ordersLink = page.locator("a[href='/customer/orders']");
        this.orderRows = page.locator(".section.order-item");

        this.orderNumber = page.locator("strong", { hasText: "Order #" });
        this.orderTotal = page.locator(".order-total strong");
        this.quantity = page.locator("td.quantity");
    }

    async goToOrders() {
        await this.ordersLink.click();
    }

    async clickOrderDetails(orderNumber: string) {
        const orderRow = this.orderRows.filter({
            has: this.page.locator("strong", { hasText: `Order Number: ${orderNumber}` })
        });

        const detailsButton = orderRow.locator("input.order-details-button");
        await detailsButton.click();
    }

    async verifyOrderDetails(expected: { orderNumber: string; bookName: string; orderTotal: string; quantity: number }) {
        // Order Number
        const actualOrderNumberText = await this.orderNumber.textContent();
        const actualOrderNumber = actualOrderNumberText?.replace("Order #", "").trim();
        expect(actualOrderNumber).toBe(expected.orderNumber);

        // Book Name
        const bookNameLocator = this.page.locator("a", { hasText: expected.bookName });
        const actualBookName = await bookNameLocator.textContent();
        expect(actualBookName?.trim()).toBe(expected.bookName);

        // Order Total
        const actualOrderTotal = await this.orderTotal.textContent();
        expect(actualOrderTotal?.trim()).toBe(expected.orderTotal);

        // Quantity
        const quantityText = await this.quantity.textContent();
        const actualQuantity = parseInt(quantityText?.replace(/\D/g, "") || "0");
        expect(actualQuantity).toBe(expected.quantity);
    }
}
