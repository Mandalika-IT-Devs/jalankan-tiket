// Logs each role in once and saves its session in .auth/<role>.json.
// The other suites and the probes reuse those sessions through support/session.ts, so no password passes
// through the model. Credentials come from .env.local as <env>_USERNAME and <env>_PASSWORD, where <env> is
// the role's "env" in product.json. A role with its own "loginURL" logs in there instead of at loginPath.
// The login steps themselves are in support/login.ts. The setup project records no trace, video or screenshot.
import { test as setup } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logIn } from './support/login';

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
    await logIn(page, { username: username!, password: password! }, role.loginURL ?? product.loginPath);

    await page.context().storageState({ path: join(authDir, `${role.key}.json`) });
  });
}
