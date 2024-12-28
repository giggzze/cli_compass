import { Page } from "@playwright/test";

interface MockClerkOptions {
  authenticated?: boolean;
  userId?: string;
  profileSetup?: boolean;
  hasActiveSession?: boolean;
}

export async function mockClerk(
  page: Page,
  options: MockClerkOptions = { 
    authenticated: true, 
    profileSetup: true,
    hasActiveSession: true 
  }
) {
  await page.addInitScript(`
    window.Clerk = {
      isReady: true,
      loaded: true,
      __unstable__environment: {},
      user: ${
        options.authenticated
          ? JSON.stringify({
              id: options.userId || "test-user-id",
              fullName: "Test User",
              primaryEmailAddress: "test@example.com",
              publicMetadata: {
                profileSetup: options.profileSetup
              }
            })
          : "null"
      },
      session: ${
        options.authenticated && options.hasActiveSession
          ? JSON.stringify({
              id: "test-session-id",
              userId: options.userId || "test-user-id",
              status: "active",
            })
          : "null"
      },
    };
  `);
}

// Helper functions for authentication scenarios
export async function mockAuthenticatedUser(page: Page) {
  await mockClerk(page, {
    authenticated: true,
    profileSetup: true,
    hasActiveSession: true
  });
}

export async function mockUnauthenticatedUser(page: Page) {
  await mockClerk(page, {
    authenticated: false,
    hasActiveSession: false
  });
}

export async function mockUserWithoutProfile(page: Page) {
  await mockClerk(page, {
    authenticated: true,
    profileSetup: false,
    hasActiveSession: true
  });
}
