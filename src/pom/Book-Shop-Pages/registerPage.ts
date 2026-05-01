import { Page, Locator, expect } from "@playwright/test";

export class RegisterPage {
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private emailInput: Locator;
    private passwordInput: Locator;
    private confirmPasswordInput: Locator;
    private registerButton: Locator;
    private successMessage: Locator;
    private userRegisterButton: Locator;
    private loginButton: Locator;
    private loginEmail: Locator;
    private loginPassword: Locator;

    constructor(private page: Page) {
        this.firstNameInput = page.getByLabel("First name:");
        this.lastNameInput = page.getByLabel("Last name:");
        this.emailInput = page.getByLabel("Email:");
        this.passwordInput = page.getByLabel("Password:", { exact: true });
        this.confirmPasswordInput = page.getByLabel("Confirm password:", { exact: true });
        this.registerButton = page.getByRole("link", { name: "Register" });
        this.successMessage = page.locator(".result");
        this.userRegisterButton = page.getByRole("button", { name: "Register" });
        this.loginButton = page.getByRole("button", { name: "Log in" });
        this.loginEmail = page.locator("#Email");
        this.loginPassword = page.locator("#Password");
    }

    async goto() {
        await this.page.goto(process.env.TASK3_URL!);
    }

    async registerRandomUser() {
        const firstName = `PW${Math.floor(Math.random() * 1000)}`;
        const lastName = `user${Math.floor(Math.random() * 1000)}`;
        const email = `user${Date.now()}@example.com`;
        const password = "Password123!";


        await this.registerButton.click();

        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);

        await this.userRegisterButton.click();

        return { firstName, lastName, email, password };
    }

    async verifyRegistration() {
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
        await expect(this.successMessage).toHaveText("Your registration completed");

        await this.page.waitForTimeout(8000);
    }

    async login(email: string, password: string) {
        await this.loginEmail.fill(email);
        await this.loginPassword.fill(password);
        await this.loginButton.click();
    }
}