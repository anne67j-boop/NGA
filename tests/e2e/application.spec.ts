import { test, expect } from "@playwright/test";

test("home and information navigation work in a real browser", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Independent Website/);
  await expect(page.getByRole("heading", { name: /Find verified grant information/i })).toBeVisible();
  await expect(page.getByText(/not a government agency or official grant portal/i)).toBeVisible();

  await page.getByRole("link", { name: "Grant information" }).click();
  await expect(page).toHaveURL(/#\/grants$/);
  await expect(page.getByRole("heading", { name: "Grant information from official sources" })).toBeVisible();

  await page.getByRole("link", { name: "Eligibility" }).click();
  await expect(page).toHaveURL(/#\/eligibility$/);
  await expect(page.getByRole("heading", { name: /Check eligibility with the administering agency/i })).toBeVisible();
});

test("application and sign-in screens do not collect credentials or applicant data", async ({ page }) => {
  await page.goto("/#/apply");
  await expect(page.getByRole("heading", { name: "Application intake is temporarily unavailable" })).toBeVisible();
  await expect(page.locator("input, textarea, form, select")).toHaveCount(0);

  await page.goto("/#/login");
  await expect(page.getByRole("heading", { name: "Sign-in is not configured" })).toBeVisible();
  await expect(page.locator("input, textarea, form, select")).toHaveCount(0);
});

test("mobile navigation remains usable and contains no false login or apply actions", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.getByRole("link", { name: "Grant information" }).click();
  await expect(page.getByRole("heading", { name: "Grant information from official sources" })).toBeVisible();
  await expect(page.getByRole("button", { name: /login|apply now|start application/i })).toHaveCount(0);
});

test("production entrypoint loads no third-party executable scripts", async ({ page }) => {
  await page.goto("/");
  const scriptSources = await page.locator("script[src]").evaluateAll((scripts) =>
    scripts.map((script) => (script as HTMLScriptElement).src)
  );
  expect(scriptSources.length).toBeGreaterThan(0);
  for (const source of scriptSources) {
    expect(new URL(source).origin).toBe(new URL(page.url()).origin);
  }
  await expect(page.getByRole("link", { name: "Official Grants.gov" }).first()).toHaveAttribute("href", "https://www.grants.gov/");
});
