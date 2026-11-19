import { test, expect } from '@playwright/test';

test.describe('Causiq Fix & Automated Verification Flow E2E', () => {
  test('Executes verification with clean telemetry and confirms incident closure', async ({ page }) => {
    await page.goto('/app/fix-verify');

    // Check Safety Guardrail warning is prominently rendered
    await expect(page.locator('text=Safety Guardrail Active')).toBeVisible();

    // Verify Run Automated Verification button is present
    const verifyButton = page.locator('button:has-text("Run Automated Verification")');
    await expect(verifyButton).toBeVisible();

    // Click Run Automated Verification
    await verifyButton.click();

    // Confirm that verification result report shows passing evaluation
    await expect(page.locator('text=VERIFICATION PASSED')).toBeVisible({ timeout: 10000 });

    // Confirm that Authorize Incident Resolution is now enabled
    const resolveButton = page.locator('button:has-text("Authorize Incident Resolution")');
    await expect(resolveButton).toBeEnabled();
  });
});
