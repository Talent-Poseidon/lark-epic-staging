import { test, expect } from '@playwright/test';

test.describe('Admin can manage projects', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /project-management...`);

    const response = await page.goto('/project-management');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/project-management/);
    await expect(page.getByTestId('project-management-page-nav')).toBeVisible();
  });

  test('Admin views the project list', async ({ page }) => {
    await expect(page.getByTestId('project-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="project-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="project-item-"]').count();
    console.log(`[Project List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin creates a new project', async ({ page }) => {
    const uniqueName = `E2E Project ${Date.now()}`;

    await page.getByTestId('project-name-input').fill(uniqueName);
    await page.getByTestId('project-description-input').fill('Test project description');
    await page.getByTestId('create-project-btn').click();

    await expect(page.getByTestId('project-created-alert')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('project-created-alert')).toContainText('Project created successfully');
    console.log(`[Project] Created: ${uniqueName}`);
  });

  test('Admin sees validation error for empty project name', async ({ page }) => {
    await page.getByTestId('create-project-btn').click();

    await expect(page.getByTestId('project-error-alert')).toBeVisible();
    await expect(page.getByTestId('project-error-alert')).toContainText('Project name is required');
  });

  test('Admin assigns an assessor to a project', async ({ page }) => {
    await page.getByTestId('assign-assessor-btn').click();

    await expect(page.getByTestId('assessor-assigned-alert')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('assessor-assigned-alert')).toContainText('Assessor has been successfully assigned');
    console.log('[Assessor] Assessor assigned successfully');
  });

  test('Admin sends invitation to participants', async ({ page }) => {
    await page.getByTestId('send-invitation-btn').click();

    await expect(page.getByTestId('invitation-sent-alert')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('invitation-sent-alert')).toContainText('Invitations have been sent');
    console.log('[Invitation] Invitation sent successfully');
  });
});
