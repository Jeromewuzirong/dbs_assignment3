const { test, expect } = require("@playwright/test");

test("add a new assignment and verify it appears on homepage", async ({ page }) => {
  // 1. Open homepage
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("All Assignments");

  // 2. Click "+ Add" button
  await page.click("text=+ Add");
  await expect(page).toHaveURL("/add");
  await expect(page.locator("h1")).toHaveText("Add Assignment");

  // 3. Fill in the form
  await page.fill('input[placeholder="e.g. MPCS 51238"]', "MPCS 52553");
  await page.fill('input[placeholder="Assignment title"]', "Cloud Computing Lab 3");
  await page.fill('input[type="date"]', "2026-04-25");
  await page.fill(
    'textarea[placeholder="Details about the assignment..."]',
    "Deploy a microservice on AWS using Docker and Kubernetes."
  );

  // 4. Submit the form
  await page.click('button:has-text("Add Assignment")');

  // 5. Verify redirect to homepage
  await expect(page).toHaveURL("/");

  // 6. Verify the new assignment appears on the homepage
  await expect(page.locator("text=Cloud Computing Lab 3")).toBeVisible();
  await expect(page.locator("text=MPCS 52553")).toBeVisible();
});
