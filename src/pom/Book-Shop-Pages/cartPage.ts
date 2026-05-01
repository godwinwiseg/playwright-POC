import { Page, expect, Locator } from "@playwright/test";

export class CartPage {

    readonly shoppingCartButton: Locator;
    readonly healthBook: Locator;
    readonly acceptTerms: Locator;
    readonly checkoutButton: Locator;
    readonly cartQty: Locator;
    readonly termsPopup: Locator;
    readonly closePopup: Locator;

    constructor(private page: Page) {
        this.shoppingCartButton = page.getByRole("link", { name: "Shopping cart" }).first();
        this.acceptTerms = page.locator("input#termsofservice");
        this.checkoutButton = page.getByRole("button", { name: "Checkout" }).first();
        this.cartQty = page.locator("span.cart-qty");
        this.termsPopup = page.locator("#ui-id-2");
        this.closePopup = page.locator("button.ui-dialog-titlebar-close");
    }

    async openCart() {
        await this.shoppingCartButton.click();
    }

    async verifyCartItem(bookName: string, bookPrice: string) {
        const cartBookName = await this.page.locator(".cart-item-row .product-name").textContent();
        const cartBookPrice = await this.page.locator(".cart-item-row .product-unit-price").textContent();

        expect(cartBookName?.trim()).toBe(bookName);
        expect(cartBookPrice?.trim()).toBe(bookPrice);
    }

    async acceptTermsCheckBox() {
        await this.acceptTerms.check();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async handleTermsPopup() {
        await expect(this.termsPopup).toBeVisible({ timeout: 10000 });
        await this.closePopup.click();

    }
}
