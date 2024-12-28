import { test, expect } from "@playwright/test";
import { mockClerk } from "@/tests/mocks/clerk";

test.describe("Navbar Component", () => {
  test.beforeEach(async ({ page }) => {
    // Mock Clerk authentication
    await mockClerk(page);
  });

  test("displays logo and title", async ({ page }) => {
    await page.goto("/");

    // Check if logo exists
    await expect(page.locator("svg.w-8.h-8")).toBeVisible();
    // Check if title exists
    await expect(page.getByText("CLI Compass")).toBeVisible();
  });

  test("shows sign in button for unauthenticated users on home page", async ({
    page,
  }) => {
    // Mock unauthenticated state
    await mockClerk(page, { authenticated: false });
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("shows public navigation for unauthenticated users on other pages", async ({
    page,
  }) => {
    // Mock unauthenticated state
    await mockClerk(page, { authenticated: false });
    await page.goto("/public/commands");

    await expect(page.getByRole("link", { name: "Commands" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Processes" })).toBeVisible();

    // Verify correct href attributes
    await expect(page.getByRole("link", { name: "Commands" })).toHaveAttribute(
      "href",
      "/public/commands"
    );
    await expect(page.getByRole("link", { name: "Processes" })).toHaveAttribute(
      "href",
      "/public/process"
    );
  });

  test("shows authenticated navigation on private command page", async ({
    page,
  }) => {
    await page.goto("/private/command");

    await expect(page.getByRole("link", { name: "Add Command" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Processes" })).toBeVisible();

    // Verify correct href attributes
    await expect(
      page.getByRole("link", { name: "Add Command" })
    ).toHaveAttribute("href", "/commands/add");
    await expect(page.getByRole("link", { name: "Processes" })).toHaveAttribute(
      "href",
      "/process"
    );
  });

  test("shows authenticated navigation on private process page", async ({
    page,
  }) => {
    await page.goto("/private/process");

    await expect(page.getByRole("link", { name: "Commands" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create Process" })
    ).toBeVisible();

    // Verify correct href attributes
    await expect(page.getByRole("link", { name: "Commands" })).toHaveAttribute(
      "href",
      "/commands/user"
    );
    await expect(
      page.getByRole("link", { name: "Create Process" })
    ).toHaveAttribute("href", "/process/add");
  });

  test("navigation links work correctly", async ({ page }) => {
    await page.goto("/private/command");

    // Click on Processes link
    await page.getByRole("link", { name: "Processes" }).click();
    await expect(page).toHaveURL("/process");

    // Click on Create Process link
    await page.getByRole("link", { name: "Create Process" }).click();
    await expect(page).toHaveURL("/process/add");

    // Click on Commands link
    await page.getByRole("link", { name: "Commands" }).click();
    await expect(page).toHaveURL("/commands/user");
  });

  test("logo links to home page", async ({ page }) => {
    await page.goto("/private/command");

    // Click on logo
    await page.getByRole("link", { name: /CLI Compass/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("handles unknown routes gracefully", async ({ page }) => {
    await page.goto("/unknown-route");

    // Should show default navigation
    await expect(page.getByRole("link", { name: "Commands" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Processes" })).toBeVisible();
  });
});
