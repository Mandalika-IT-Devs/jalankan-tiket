// Logs each role in once and saves its session in .auth/<role>.json.
// The other suites and the probes reuse those sessions through support/session.ts, so no password passes
// through the model. Credentials come from .env.local as <env>_USERNAME and <env>_PASSWORD, where <env> is
// the role's "env" in product.json. A role with its own "loginURL" logs in there instead of at loginPath.
import { test as setup, expect } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { redactUrl, urlHasSecret } from './support/redact';

type Role = { key: string; label: string; env: string; loginURL?: string };

const product = JSON.parse(readFileSync(join(__dirname, '..', 'product.json'), 'utf8'));
const authDir = join(__dirname, '..', '.auth');
mkdirSync(authDir, { recursive: true });

for (const role of product.roles as Role[]) {
  setup(`login ${role.key}`, async ({ page }) => {
    const username = process.env[`${role.env}_USERNAME`];
    const password = process.env[`${role.env}_PASSWORD`];
    setup.skip(!username || !password, `BLOCKED: ${role.env}_USERNAME or ${role.env}_PASSWORD is empty in .env.local`);

    if (role.loginURL && !product.allowedHosts.includes(new URL(role.loginURL).hostname)) {
      throw new Error(`The loginURL of role ${role.key} is not on a host in allowedHosts of product.json.`);
    }
    await page.goto(role.loginURL ?? product.loginPath);

    // Wait until the page's own script is ready. A server-rendered form that is used before it hydrates
    // submits natively: the fields empty, and the password can end up in the URL.
    await expect({{PAGE_READY}}).toBeVisible();

    await {{USERNAME_FIELD}}.fill(username!);
    await {{PASSWORD_FIELD}}.fill(password!);
    await {{SUBMIT_BUTTON}}.click();
    try {
      await expect({{LOGGED_IN_CHECK}}).toBeVisible();
    } finally {
      if (urlHasSecret(page.url(), [password])) {
        throw new Error(
          `BLOCKED: the login form sent the password in the URL (${redactUrl(page.url())}). ` +
            'This is a bug candidate. Ask the QA engineer to change the password of this test account.',
        );
      }
    }

    await page.context().storageState({ path: join(authDir, `${role.key}.json`) });
  });
}
