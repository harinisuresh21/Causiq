import { test, expect } from '@playwright/test';

test.describe('Causiq Autonomous Investigation Flow E2E', () => {
  test('Launches investigation and verifies stages and hypothesis generation', async ({ page }) => {
    await page.goto('/app/investigations');

    // Verify workspace loaded
    await expect(page.locator('button:has-text("+ New Incident")')).toBeVisible();

    // Click Run Autonomous Investigation
    const runButton = page.locator('button:has-text("Run Autonomous Investigation")');
    await runButton.click();

    // Verify progression indicator or findings appear
    await expect(page.locator('text=Remediation Playbook (Human-in-the-Loop)')).toBeVisible({ timeout: 15000 });
  });

  test('Opens new incident modal and checks demo scenario presets', async ({ page }) => {
    await page.goto('/app/investigations');

    await page.click('button:has-text("+ New Incident")');
    await expect(page.locator('text=Start a New Causiq Investigation')).toBeVisible();

    // Select a demo scenario
    const demoCard = page.locator('text=DEMO DATA').first();
    await demoCard.click();

    // Cancel modal
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('text=Start a New Causiq Investigation')).not.toBeVisible();
  });
});
