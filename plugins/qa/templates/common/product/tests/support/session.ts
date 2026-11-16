// Saved sessions per role, kept fresh after every test.
// Made by the qa plugin of the jalankan-tiket kit.
//
// Many apps rotate their refresh token on each page load and end the whole session when an old token
// comes back. A plain `test.use({ storageState })` then works for one test only: the next test starts from
// the same, now outdated, .auth file and is logged out. This fixture loads .auth/<role>.json and writes the
// browser's state back after every test, so the next test starts from the newest token. That is safe
// because the suites run with one worker.
//
// Usage in a spec:
//   import { test, expect } from '../support/session';
//   test.use({ role: 'admin' });
// A test that logs out, or ends its session on purpose, also sets `test.use({ saveSession: false })`.
import { test as base, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const authFile = (role: string) => join(__dirname, '..', '..', '.auth', `${role}.json`);

type SessionOptions = {
  /** The role key from product.json whose saved session the test uses, or null for a guest. */
  role: string | null;
  /** Write the session back after the test. Turn it off for tests that log out. */
  saveSession: boolean;
};

export const test = base.extend<SessionOptions>({
  role: [null, { option: true }],
  saveSession: [true, { option: true }],

  storageState: async ({ role, storageState }, use) => {
    if (role && !existsSync(authFile(role))) {
      throw new Error(`BLOCKED: no saved session for role "${role}". Run the setup project first.`);
    }
    await use(role ? authFile(role) : storageState);
  },

  context: async ({ context, role, saveSession }, use) => {
    await use(context);
    if (role && saveSession) await context.storageState({ path: authFile(role) });
  },
});

export { expect };
