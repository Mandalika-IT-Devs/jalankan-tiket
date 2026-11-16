// Logs each role in once and saves its session in .auth/<role>.json.
// The other suites and the browser tools reuse those sessions, so no password passes through the model.
// Credentials come from .env.local as <env>_USERNAME and <env>_PASSWORD, where <env> is the role's "env" in product.json.
import { test as setup, expect } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type Role = { key: string; label: string; env: string };

const product = JSON.parse(readFileSync(join(__dirname, '..', 'product.json'), 'utf8'));
const authDir = join(__dirname, '..', '.auth');
mkdirSync(authDir, { recursive: true });

for (const role of product.roles as Role[]) {
  setup(`login ${role.key}`, async ({ page }) => {
    const username = process.env[`${role.env}_USERNAME`];
    const password = process.env[`${role.env}_PASSWORD`];
    setup.skip(!username || !password, `BLOCKED: ${role.env}_USERNAME or ${role.env}_PASSWORD is empty in .env.local`);

    await page.goto(product.loginPath);
    await {{USERNAME_FIELD}}.fill(username!);
    await {{PASSWORD_FIELD}}.fill(password!);
    await {{SUBMIT_BUTTON}}.click();
    await expect({{LOGGED_IN_CHECK}}).toBeVisible();

    await page.context().storageState({ path: join(authDir, `${role.key}.json`) });
  });
}
