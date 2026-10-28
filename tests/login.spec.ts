import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

test.beforeEach(async ({ page }) => {
  await new HomePage(page).goto();
})

test('Login Test with valid credential', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.clickLogin();
  await loginPage.loginUser('james.moe@yopmail.com', 'gsm123456');

  await expect(page.getByRole('link', { name: 'james.moe@yopmail.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
});

test('Login Test with invalid credentail', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.clickLogin();
  await loginPage.loginUser('invalid.email@yopmail.com', 'gsm123456');

  // Check the error message
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('No customer account found');

  await loginPage.loginUser('james.moe@yopmail.com', 'wrong');

  // Check the error message
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('The credentials provided are incorrect');
});