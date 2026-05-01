import { test, expect } from "../test-fixtures/testFixtures";

test("Task 3 - Buy Health Book", async ({ page, registerPage, booksPage, cartPage, checkoutPage, orderDetailsPage, }) => {
  //Step 1: Register
  await registerPage.goto();
  const user = await registerPage.registerRandomUser();
  await registerPage.verifyRegistration();

  //Step 2: Navigate to Books , Select sorting High to Low, Select view as List, Add Health book to the cart, Select the cart
  await booksPage.navigateToBooks();
  await booksPage.sortHighToLow("Price: High to Low");
  await booksPage.viewAsList("List");
  await booksPage.addBookToCart("Health Book");
  await cartPage.openCart();

  //Step 3: Click on the checkout button , Verify the pop up message, click on the close button
  await cartPage.checkout();
  await cartPage.handleTermsPopup();

  //Step 4: Verify the book you have added and the price(assert it)
  await cartPage.verifyCartItem("Health Book", "10.00");

  //Step 5: Click on terms and condition checkbox
  await cartPage.acceptTermsCheckBox();
  await cartPage.checkout();

  await page.waitForTimeout(2000);

  //Step 6: Complete the steps to make the order placed
  await checkoutPage.fillBillingAddress({
    country: "India",
    city: "Chennai",
    address: "123 Mount Road",
    zip: "600001",
    phone: "9876543210",
  });

  //Complete Checkout page
  await checkoutPage.billingContinue.click({ timeout: 10000 });

  await checkoutPage.shippingAddressContinue.click({ timeout: 10000 });

  await checkoutPage.selectShippingMethod("Ground (10.00)");
  await checkoutPage.shippingMethodContinue.click({ timeout: 10000 });

  await checkoutPage.selectPaymentMethod("Cash On Delivery");
  await checkoutPage.paymentMethodContinue.click({ timeout: 10000 });

  await checkoutPage.paymentInfoContinue.click({ timeout: 10000 });

  await checkoutPage.clickConfirm();
  await checkoutPage.assertOrderSuccessMessage();

  const orderNumber = await checkoutPage.captureOrderNumber();
  console.log('Captured Order Number:', orderNumber);

  //Step 7: Navigate to Orders Verify your order(Price, book Name etc)
  await orderDetailsPage.goToOrders();
  await orderDetailsPage.clickOrderDetails(orderNumber);
  await orderDetailsPage.verifyOrderDetails({
    orderNumber: orderNumber,
    bookName: "Health Book",
    orderTotal: "27.00",
    quantity: 1
  });

});
