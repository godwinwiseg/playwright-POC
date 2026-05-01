import { Page, Locator, expect } from "@playwright/test";

export class BooksPage {
    readonly booksLink: Locator;
    readonly viewDropdown: Locator;
    readonly sortDropdown: Locator;
    readonly notification: Locator;
    readonly notificationContent: Locator;
    readonly notificationClose: Locator;

    constructor(private page: Page) {
        this.booksLink = page.getByRole("link", { name: "Books" }).first();
        this.viewDropdown = page.locator("select#products-viewmode");
        this.sortDropdown = page.locator("select#products-orderby");
        this.notification = page.locator("#bar-notification");
        this.notificationContent = this.notification.locator(".content");
        this.notificationClose = this.notification.locator(".close");

    }

    async sortHighToLow(optionLabel: string) {
        await this.sortDropdown.selectOption({ label: optionLabel });
    }

    async viewAsList(view: string) {
        await this.viewDropdown.selectOption({ label: view });
    }

    async addBookToCart(bookName: string) {
        const bookLocator = this.page.locator(".product-item", { hasText: bookName });
        await bookLocator.locator("input[value='Add to cart']").click();
        
        await expect(this.notification).toBeVisible({timeout: 15000});
        await expect(this.notificationContent).toContainText("The product has been added to your shopping cart");
        
        await this.notificationClose.click();
    }

    async navigateToBooks() {
    await this.booksLink.click();
}
}
