import { Page } from '@playwright/test';

interface MockClerkOptions {
  authenticated?: boolean;
  userId?: string;
}

export async function mockClerk(page: Page, options: MockClerkOptions = { authenticated: true }) {
  await page.addInitScript(`
    window.Clerk = {
      isReady: true,
      mounted: true,
      __unstable__environment: {},
      user: ${options.authenticated ? JSON.stringify({
        id: options.userId || 'test-user-id',
        fullName: 'Test User',
        primaryEmailAddress: 'test@example.com',
      }) : 'null'},
      session: ${options.authenticated ? JSON.stringify({
        id: 'test-session-id',
        userId: options.userId || 'test-user-id',
      }) : 'null'},
    };
  `);
}
