// The login steps of this product, shared by auth.setup.ts and by the few specs that may log in by themselves.
// Made by the qa plugin of the jalankan-tiket kit.
//
// A spec logs in by itself only in two cases: the QA engineer allowed it for the run, or the account is one
// that the test created itself, with a password generated at runtime. Such a spec turns off what records
// typed values, and never prints, snapshots or screenshots a page while a field still holds the password:
//
//   import { test, expect } from '../support/session';
//   import { logIn } from '../support/login';
//   test.use({ trace: 'off', video: 'off', screenshot: 'off' });
//   await logIn(page, { username, password }, '/login');
//
// Every login counts against the app's rate limit. After one answer with HTTP 429, logins pause for
// PAUSE_MINUTES, in this run and in the next ones, and every login in that time is BLOCKED.
import { expect, type Locator, type Page, type Response } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { redactUrl, urlHasSecret } from './redact';

export type Credentials = { username: string; password: string };

type LoginPage = { ready: Locator; username: Locator; password: Locator; submit: Locator; loggedIn: Locator };

// One entry per login page. "default" serves the login page at loginPath. A product whose roles log in on
// another host, such as a back office, adds an entry keyed by that host name, with that page's locators.
const loginPages: Record<string, (page: Page) => LoginPage> = {
  default: (page) => ({
    // Something that appears only once the page's own script has run. A server-rendered form that is used
    // before it hydrates submits natively: the fields empty, and the password can end up in the URL.
    ready: {{PAGE_READY}},
    username: {{USERNAME_FIELD}},
    password: {{PASSWORD_FIELD}},
    submit: {{SUBMIT_BUTTON}},
    loggedIn: {{LOGGED_IN_CHECK}},
  }),
};

const PAUSE_MINUTES = 15;
const authDir = join(__dirname, '..', '..', '.auth');
const pauseFile = join(authDir, 'login-paused-until');

export async function logIn(page: Page, { username, password }: Credentials, loginURL: string) {
  if (existsSync(pauseFile)) {
    const until = Number(readFileSync(pauseFile, 'utf8'));
    if (Date.now() < until) {
      throw new Error(`BLOCKED: logins pause until ${new Date(until).toISOString()} after a rate limit (HTTP 429).`);
    }
  }

  let rateLimited = false;
  const watch = (response: Response) => {
    if (response.status() === 429) rateLimited = true;
  };
  let form: LoginPage | undefined;
  page.on('response', watch);
  try {
    await page.goto(loginURL);
    form = (loginPages[new URL(page.url()).hostname] ?? loginPages.default)(page);
    await expect(form.ready).toBeVisible();
    await form.username.fill(username);
    await form.password.fill(password);
    await form.submit.click();
    await expect(form.loggedIn).toBeVisible();
  } finally {
    page.off('response', watch);
    // Empty a field that still holds the password, so that the snapshot of a failed test cannot record it.
    await form?.password.fill('', { timeout: 1_000 }).catch(() => {});
    if (urlHasSecret(page.url(), [password])) {
      throw new Error(
        `BLOCKED: the login form sent the password in the URL (${redactUrl(page.url())}). ` +
          'This is a bug candidate. Ask the QA engineer to change the password of this test account.',
      );
    }
    if (rateLimited) {
      mkdirSync(authDir, { recursive: true });
      writeFileSync(pauseFile, String(Date.now() + PAUSE_MINUTES * 60_000));
      throw new Error(`BLOCKED: the login answered HTTP 429. Logins pause for ${PAUSE_MINUTES} minutes.`);
    }
  }
}
