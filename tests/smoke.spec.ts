import { expect, test } from '@playwright/test';

/**
 * Behavioural smoketest — clicks the REAL controls and asserts real navigation,
 * against the built site served by `astro preview`. Generalized from the TVA
 * tva-smoketest pattern. Runs on Desktop Chrome + Pixel 7 (see playwright.config).
 */

test('home page loads with the head term H1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText(/carpentry/i);
  await expect(page).toHaveTitle(/perth/i);
});

test('primary CTA scrolls to the quote form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /get a quote/i }).first().click();
  await expect(page.locator('#quote')).toBeInViewport();
});

test('quote form has labelled required fields + consent', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/your name/i)).toBeVisible();
  await expect(page.getByLabel(/phone/i).first()).toBeVisible();
  await expect(page.getByLabel(/happy to be contacted/i)).toBeVisible();
});

test('services grid renders every service', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#services h3')).toHaveCount(4);
  await expect(page.locator('#service-formwork')).toBeVisible();
});

test('skip link is the first focusable element', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused();
});

test('404 page routes back home', async ({ page }) => {
  const res = await page.goto('/does-not-exist');
  // Static hosts serve 404.html; assert the page content regardless of status.
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
  await page.getByRole('link', { name: /back to home/i }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(res).toBeTruthy();
});

test('footer NAP shows the ABN from business-info', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('25 601 540 201');
});
