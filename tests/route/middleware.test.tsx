import { test, expect } from "@playwright/test";
import { 
  mockAuthenticatedUser, 
  mockUnauthenticatedUser, 
  mockUserWithoutProfile 
} from "@/tests/mocks/clerk";

test.describe("Middleware Authentication Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await page.context().clearCookies();
  });

  // Test private paths redirect to login when not authenticated
  const privatePaths = [
    "/private/command",
    "/private/command/add",
    "/private/process",
    "/private/process/add",
    "/private/process/[id]",
    "private/profile-setup",
  ];

  for (const path of privatePaths) {
    test(`unauthenticated access to ${path} redirects to login`, async ({ page }) => {
      await mockUnauthenticatedUser(page);
      
      // Try to access private path
      await page.goto(path);
      
      // Should be redirected to login
      await expect(page).toHaveURL(/.*\/public\/login/);
    });
  }

  // Test public paths are accessible without authentication
  const publicPaths = [
    "/public/login",
    "/public/signup",
    "/",
  ];

  for (const path of publicPaths) {
    test(`public path ${path} is accessible without auth`, async ({ page }) => {
      await mockUnauthenticatedUser(page);
      
      // Access public path
      await page.goto(path);
      
      // Should not be redirected
      await expect(page).toHaveURL(path);
    });
  }

  // Test authenticated access
  test("authenticated user can access private paths", async ({ page }) => {
    await mockAuthenticatedUser(page);

    // Try accessing a private path
    await page.goto("/private/process");
    
    // Should not be redirected
    await expect(page).toHaveURL("/private/process");
  });

  // Test profile setup redirect
  test("user without profile setup is redirected", async ({ page }) => {
    await mockUserWithoutProfile(page);

    // Try accessing a private path
    await page.goto("/private/command");
    
    // Should be redirected to profile setup
    await expect(page).toHaveURL(/.*\/private\/profile-setup/);
  });
});
