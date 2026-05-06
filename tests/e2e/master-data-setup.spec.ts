import { test, expect } from '@playwright/test';

test.describe('Admin can manage master data setup', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /master-data-setup...`);

    const response = await page.goto('/master-data-setup');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/master-data-setup/);
    await expect(page.getByTestId('master-data-page-nav')).toBeVisible();
  });

  test('Admin submits Kamus by template', async ({ page }) => {
    const title = test.info().title;

    await page.getByTestId('submit-kamus-btn').click();
    console.log(`[Test: ${title}] Clicked Submit Kamus button`);

    await expect(page.getByTestId('kamus-submitted-alert'))
      .toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('kamus-submitted-alert'))
      .toContainText('Kamus Submitted Successfully');
    console.log(`[Test: ${title}] Kamus submitted successfully`);
  });

  test('Admin submits Standar', async ({ page }) => {
    const title = test.info().title;

    await page.getByTestId('submit-standar-btn').click();
    console.log(`[Test: ${title}] Clicked Submit Standar button`);

    await expect(page.getByTestId('standar-submitted-alert'))
      .toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('standar-submitted-alert'))
      .toContainText('Standar Submitted Successfully');
    console.log(`[Test: ${title}] Standar submitted successfully`);
  });

  test('Admin submits Scenario', async ({ page }) => {
    const title = test.info().title;

    await page.getByTestId('submit-scenario-btn').click();
    console.log(`[Test: ${title}] Clicked Submit Scenario button`);

    await expect(page.getByTestId('scenario-submitted-alert'))
      .toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('scenario-submitted-alert'))
      .toContainText('Scenario Submitted Successfully');
    console.log(`[Test: ${title}] Scenario submitted successfully`);
  });
});
