import { test, expect } from '@playwright/test';

test('Index mounts', async ({ page }) => {
  await page.goto('/');

  // Expect PodSnacks logo
  await expect(page.locator('#root-div')).toBeVisible();
});
