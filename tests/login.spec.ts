import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { VALID_USER } from '../data/Data';

test.beforeEach(async ({ page }) => {
  await new HomePage(page).goto();
})

test('Login Test with valid credential', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.clickLogin();
  await loginPage.loginUser(VALID_USER.email, VALID_USER.password);

  await expect(page.getByRole('link', { name: VALID_USER.email })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
});

test('Login Test with invalid credentail', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.clickLogin();
  await loginPage.loginUser('invalid.email@yopmail.com', VALID_USER.password);

  // Check the error message
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('No customer account found');

  await loginPage.loginUser(VALID_USER.email, 'wrong');

  // Check the error message
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('The credentials provided are incorrect');
});