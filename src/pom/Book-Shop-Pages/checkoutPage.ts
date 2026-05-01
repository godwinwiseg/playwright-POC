import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
    private page: Page;
    private countryDropdown: Locator;
    private billingCity: Locator;
    private billingAddress: Locator;
    private billingZipCode: Locator;
    private billingPhone: Locator;
    private confirmButton: Locator;
    private successMessage: Locator;

    readonly paymentMethodContinue: Locator;
    readonly shippingMethodContinue: Locator;
    readonly shippingAddressContinue: Locator;
    readonly billingContinue: Locator;
    readonly paymentInfoContinue: Locator;
    readonly orderNumber: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countryDropdown = page.locator("select#BillingNewAddress_CountryId");
        this.billingCity = page.locator("#BillingNewAddress_City");
        this.billingAddress = page.locator("#BillingNewAddress_Address1");
        this.billingZipCode = page.locator("#BillingNewAddress_ZipPostalCode");
        this.billingPhone = page.locator("#BillingNewAddress_PhoneNumber");
        this.confirmButton = page.getByRole("button", { name: "Confirm" });
        this.successMessage = page.locator("div.title strong");
        this.orderNumber = page.locator("li", { hasText: "Order number:" });

        this.paymentMethodContinue = page.locator("input.payment-method-next-step-button[onclick='PaymentMethod.save()']");
        this.shippingMethodContinue = page.locator("input.shipping-method-next-step-button[onclick='ShippingMethod.save()']");
        this.shippingAddressContinue = page.locator("input.new-address-next-step-button[title='Continue']").nth(1);
        this.billingContinue = page.locator("input.new-address-next-step-button[title='Continue']").first();
        this.paymentInfoContinue = page.locator("input.payment-info-next-step-button[onclick='PaymentInfo.save()']");
    }

    async selectCountryFromDropdown(countryName: string) {
        await this.countryDropdown.selectOption({ label: countryName });
    }

    async fillBillingAddress(details: {
        country: string;
        city: string;
        address: string;
        zip: string;
        phone: string;
    }) {
        const { country, city, address, zip, phone } = details;

        await this.countryDropdown.selectOption({ label: country });
        await this.billingCity.fill(city);
        await this.billingAddress.fill(address);
        await this.billingZipCode.fill(zip);
        await this.billingPhone.fill(phone);
    }

    async selectShippingMethod(optionName: string) {
        const shippingMethod = this.page.getByRole('radio', { name: optionName });
        await shippingMethod.check();
    }


    async selectPaymentMethod(payment: string) {
        const paymentMethod = this.page.getByRole('radio', { name: new RegExp(payment, 'i') });
        await paymentMethod.check();
    }

    async clickConfirm() {
        await this.confirmButton.click({ timeout: 10000 });
    }

    async assertOrderSuccessMessage() {

        await expect(this.successMessage).toBeVisible({ timeout: 15000 });
        await expect(this.successMessage).toHaveText("Your order has been successfully processed!");
    }

    async captureOrderNumber(): Promise<string> {
        const text = await this.orderNumber.textContent();
        return text?.replace('Order number:', '').trim() || '';
    }


}
