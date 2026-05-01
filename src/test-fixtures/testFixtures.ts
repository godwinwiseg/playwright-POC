import { test as base, Page } from "@playwright/test";
import { RegisterPage } from "../pom/Book-Shop-Pages/registerPage";
import { BooksPage } from "../pom/Book-Shop-Pages/booksPage";
import { CartPage } from "../pom/Book-Shop-Pages/cartPage";
import { CheckoutPage } from "../pom/Book-Shop-Pages/checkoutPage";
import { OrderDetailsPage } from "../pom/Book-Shop-Pages/orderDetailsPage";
import { WebTablePage } from "../pom/webTablePage";
import { SurveyQuestionsPage } from "../pom/surveysPage";

type Pages = {
  registerPage: RegisterPage;
  booksPage: BooksPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderDetailsPage: OrderDetailsPage;
  webTablePage: WebTablePage;
  surveyPage: SurveyQuestionsPage;
};

export const test = base.extend<Pages>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },
  webTablePage: async ({ page }, use) => {
    await use(new WebTablePage(page));
  },
  surveyPage: async ({ page }, use) => {
    await use(new SurveyQuestionsPage(page));
  },
});

export { expect } from "@playwright/test";
