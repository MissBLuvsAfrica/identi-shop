import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check for main elements
    await expect(page.getByRole('heading', { name: /IDENTI/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /SHOP NOW/i })).toBeVisible();
  });

  test('can navigate to shop page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Shop/i }).first().click();

    await expect(page).toHaveURL(/\/shop/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('can navigate to about page', async ({ page }) => {
    await page.goto('/about');

    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('heading', { name: /ABOUT/i })).toBeVisible();
  });

  test('can navigate to contact page', async ({ page }) => {
    await page.goto('/contact');

    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole('heading', { name: /CONTACT/i })).toBeVisible();
  });

  test('can navigate to FAQs page', async ({ page }) => {
    await page.goto('/faqs');

    await expect(page).toHaveURL(/\/faqs/);
    await expect(
      page.getByRole('heading', { name: /FREQUENTLY ASKED QUESTIONS/i })
    ).toBeVisible();
  });

  test('can navigate to returns page', async ({ page }) => {
    await page.goto('/returns');

    await expect(page).toHaveURL(/\/returns/);
    await expect(page.getByText(/No returns/i)).toBeVisible();
  });

  test('cart page shows empty state', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.getByText(/YOUR BAG IS EMPTY/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /START SHOPPING/i })).toBeVisible();
  });

  test('checkout redirects to cart when empty', async ({ page }) => {
    await page.goto('/checkout');

    // Should redirect to cart
    await expect(page).toHaveURL(/\/cart/);
  });

  test('WhatsApp button is visible', async ({ page }) => {
    await page.goto('/');

    // WhatsApp floating button should be present
    await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');

    // Check footer sections
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Privacy/i })).toBeVisible();
  });
});

test.describe('Admin Pages', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByText(/Admin Login/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /LOGIN/i })).toBeVisible();
  });

  test('admin pages redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('admin products page redirects to login', async ({ page }) => {
    await page.goto('/admin/products');

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('admin orders page redirects to login', async ({ page }) => {
    await page.goto('/admin/orders');

    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('login, reach dashboard, logout when credentials in env', async ({ page }) => {
    const user = process.env.E2E_ADMIN_USER || process.env.ADMIN_USER;
    const pass = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!user || !pass, 'E2E_ADMIN_USER and E2E_ADMIN_PASSWORD (or ADMIN_USER + E2E_ADMIN_PASSWORD) required');

    await page.goto('/admin/login');
    await page.getByLabel(/username/i).fill(user as string);
    await page.getByLabel(/password/i).fill(pass as string);
    await page.getByRole('button', { name: /LOGIN/i }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Legal Pages', () => {
  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');

    await expect(page.getByRole('heading', { name: /TERMS OF SERVICE/i })).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.getByRole('heading', { name: /PRIVACY POLICY/i })).toBeVisible();
  });

  test('cookies page loads', async ({ page }) => {
    await page.goto('/cookies');

    await expect(page.getByRole('heading', { name: /COOKIE POLICY/i })).toBeVisible();
  });
});
