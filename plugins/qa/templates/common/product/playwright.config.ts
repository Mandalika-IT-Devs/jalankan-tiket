// Made by the qa plugin of the jalankan-tiket kit.
// Run from the workspace root: npx playwright test -c products/<slug>
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const product = JSON.parse(readFileSync(join(__dirname, 'product.json'), 'utf8'));

// Credentials stay in .env.local. Agents never read that file; the tests do.
const envFile = join(__dirname, '.env.local');
if (existsSync(envFile)) process.loadEnvFile(envFile);

// Stop before any test when the target is not a host the QA engineer confirmed as non-production.
const host = new URL(product.baseURL).hostname;
if (!product.allowedHosts.includes(host)) {
  throw new Error(`Host ${host} is not in allowedHosts of product.json. No test was run.`);
}

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  forbidOnly: true,
  // A retry would hide a flaky result. The qa skills report flakiness as INCONCLUSIVE instead.
  retries: 0,
  // Staging is shared with other people, so tests run one at a time.
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: product.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: [/auth\.setup\.ts/, /\.probe\.ts$/],
    },
    // Probes of exploratory sessions and reproductions. They run only when asked for.
    {
      name: 'probe',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testMatch: /\.probe\.ts$/,
    },
  ],
});
