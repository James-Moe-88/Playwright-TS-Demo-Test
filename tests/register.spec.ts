import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { VALID_USER } from '../data/Data';
import { RegisterPage } from '../pages/RegisterPage';

test.beforeEach(async ({ page }) => {
    await new HomePage(page).goto();
});

test('Register Existing User', async ({ page }) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);

    await homePage.clickRegister();

    await registerPage.registerUser(VALID_USER.gender, VALID_USER.firstName, VALID_USER.lastName, VALID_USER.email, VALID_USER.password);

    // Check the error messgae is visible and show as 'The specified email already exists' or not
    await expect(registerPage.errorMessage).toBeVisible();
    await expect(registerPage.errorMessage).toHaveText("The specified email already exists");
});

test('Register New User', async ({ page }) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);

    const uniqueEmail = `james.moe_${Date.now()}@yopmail.com`;;
    await homePage.clickRegister();

    await registerPage.registerUser(VALID_USER.gender, VALID_USER.firstName, VALID_USER.lastName, uniqueEmail, VALID_USER.password);

    // Check the registration complete message is visible and show as 'Your registration completed' or not
    await expect(registerPage.resultMessage).toBeVisible();
    await expect(registerPage.resultMessage).toHaveText('Your registration completed');

    await registerPage.clickContinue();
    // Check the home page menu, first link is unique email and second link is 'Log out' or not
    await expect(homePage.accountLink).toBeVisible();
    await expect(homePage.accountLink).toHaveText(uniqueEmail);
    await expect(homePage.logoutLink).toBeVisible();
    await expect(homePage.logoutLink).toHaveText("Log out");

    // Click 'Log out' button
    await homePage.clickLogout();

    // Check the home page menu, first link is 'Register' and second link is 'Log in' or not
    await expect(homePage.registerLink).toBeVisible();
    await expect(homePage.registerLink).toHaveText("Register");
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.loginLink).toHaveText("Log in");
});
