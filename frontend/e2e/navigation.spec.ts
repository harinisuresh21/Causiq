import { test, expect } from '@playwright/test';

test.describe('Causiq End-to-End Navigation & Usability', () => {
  test('Landing page loads and transitions to dashboard on Try Causiq click', async ({ page }) => {
    await page.goto('/');

    // Check title and branding
    await expect(page).toHaveTitle(/Causiq/i);
    await expect(page.locator('text=Causiq Isolates The Failure Truth')).toBeVisible();

    // Click Try Causiq
    const tryButton = page.locator('button:has-text("Try Causiq")').first();
    await tryButton.click();

    // Verify URL transitioned to /app
    await expect(page).toHaveURL(/\/app/);
    await expect(page.locator('h1:has-text("Command Center")')).toBeVisible();
  });

  test('Sidebar navigates across all core autonomous SRE workspaces', async ({ page }) => {
    await page.goto('/app');

    // Navigate to Investigations
    await page.click('nav >> text=Investigations');
    await expect(page).toHaveURL(/\/app\/investigations/);
    await expect(page.locator('text=Investigation Pipeline')).toBeVisible();

    // Navigate to Evidence Graph
    await page.click('nav >> text=Evidence Graph');
    await expect(page).toHaveURL(/\/app\/evidence-graph/);
    await expect(page.locator('text=Interactive Evidence Relationship Graph')).toBeVisible();

    // Navigate to Integrations
    await page.click('nav >> text=Integrations');
    await expect(page).toHaveURL(/\/app\/integrations/);
    await expect(page.locator('text=Integrations & Observability Hub')).toBeVisible();

    // Navigate to Fix & Verify
    await page.click('nav >> text=Fix & Verify');
    await expect(page).toHaveURL(/\/app\/fix-verify/);
    await expect(page.locator('text=Fix & Verify Remediation Workspace')).toBeVisible();
  });
});
