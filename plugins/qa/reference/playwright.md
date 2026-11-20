# Writing and running Playwright tests

The `penguji` and `pemeriksa` agents follow this file. Run everything from the workspace root.

## Layout

```
products/<slug>/tests/
  auth.setup.ts              logs in once per role (stage 1)
  support/session.ts         saved sessions per role, written back after every test
  support/login.ts           the product's login steps, for auth.setup.ts and the few specs that may log in
  support/redact.ts          redactUrl and urlHasSecret
  smoke/smoke.spec.ts        the critical flows, short and read-only where possible
  <area>/<area>.spec.ts      automated cases of one area, such as cuti/cuti.spec.ts
  api/<area>.api.spec.ts     API checks
  a11y/a11y.spec.ts          accessibility scans
  explore/*.probe.ts         probes of exploratory sessions, kept for the record
  repro/*.probe.ts           the pemeriksa's reproduction probes
```

## Specs

- **One test per case.** The title starts with the case ID: `test('TC-CUTI-004: pengajuan melebihi saldo ditolak', …)`. Results are mapped back to cases through that ID.
- **Roles.** Import `test` and `expect` from `support/session.ts`, never straight from `@playwright/test`, and pick the role per file or `describe` block:

  ```ts
  import { test, expect } from '../support/session';
  test.use({ role: 'karyawan' });
  ```

  The fixture writes the session back after every test, because many apps rotate their refresh token and log out a second test that starts from the same old file. A test that logs out sets `test.use({ saveSession: false })`. A case that needs a role without a session is BLOCKED.
- **Logging in inside a spec.** Some cases need a fresh login, such as a session after logout, or a login on two devices. A spec may log in only through `logIn` from `support/login.ts`, and only in one of two ways:
  - **With an account the test created itself,** with a password generated at runtime, such as `crypto.randomUUID()`. Allowed when creating the account triggers no `unknown` or `real` side effect. Never print, store or commit that password.
  - **With a shared test account,** through `process.env` as `auth.setup.ts` does, only when the QA engineer allowed it for this run. The permission is written in the run's `run/brief.md`.

  Such a spec sets `test.use({ trace: 'off', video: 'off', screenshot: 'off' })`, because they record what a test types. While a field holds a real password, never print the page, call `ariaSnapshot()`, take a screenshot or read the field's value. Every login counts against the app's rate limit: keep logins few, and after an HTTP 429 `logIn` pauses every login for 15 minutes.
- **Server-rendered pages.** Before filling a form, wait for a sign that the page's own script has run, as `auth.setup.ts` does with its ready check. A form used before it hydrates submits natively and loses its input.
- **URLs in output.** Print or log a URL only through `redactUrl` from `support/redact.ts`. A URL can carry a password, a token or a one-time code in its query.
- **Locators,** in this order: `getByRole` with the accessible name, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`. CSS or XPath only when nothing else works, with a comment that says why.
- **Waiting.** Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`). Never use `page.waitForTimeout`, and never wait for `networkidle`.
- **Assertions prove the business outcome.** A URL or a title alone proves nothing. After an action that saves data, read it back: reload the list, open the record, or call the API, and assert the stored values. Where roles matter, check it as the other role too.
- **Data.** Every value that creates a record carries `testDataPrefix`, plus something unique, such as `QA-AUTO cuti ${Date.now()}`. Never touch a record without the prefix, except to read it.
- **No retries and no skipped assertions.** Never add `retries`, `test.fixme` or a looser assertion to make a test pass. When the expected result itself is in doubt, it is a question for the product team, not a reason to change the test. The one exception is a new design written in a product document or commit that replaced the expected result: update it from that source, and mark the result `EXPECTED UPDATED: <source>`.
- **Shared quotas.** When the run's `run/brief.md` limits something across agents, such as sign-up emails or chat messages, write the request's key to the quota's ledger in `run/` before you send it, and check the ledger first. A retry of the same key uses no new unit.

## API checks

Use the `request` fixture, or `page.request` to keep the role's session cookies. For each endpoint:
- the status code, including the expected 4xx for invalid input and for a role without rights. A 500 is always a FAIL;
- the response shape: required fields, data types, no internal details such as stack traces;
- business values, compared with what was sent or with the UI;
- what was stored, read back with a second call.

A 200 status with wrong data is a FAIL.

## Accessibility

```ts
import AxeBuilder from '@axe-core/playwright';
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();
expect(results.violations).toEqual([]);
```

- Wait for the page's main content before `analyze()`, including what the client renders later, such as buttons in a cart row: `await expect(page.getByRole('button', { name: … })).toBeVisible()`. A scan that runs too early misses those elements and passes falsely.
- Never disable a rule to get a clean result. Report each violation with its rule, its impact and the elements it found.
- A clean scan covers only part of WCAG. Keyboard use, focus order, and the meaning of labels and messages need a manual or exploratory check, and the report says so.

## Responsive

Run layout cases at three widths: 375, 768 and 1280 pixels (`test.use({ viewport: { width: 375, height: 812 } })`). Assert what must hold, such as no horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`) and the main action visible. Attach a screenshot for each width.

## Probes

A probe is a short spec that looks at a page and reports what it sees. Exploratory sessions and reproductions are made of probes. A probe file ends in `.probe.ts`, so it runs only in the `probe` project and never with the suites.

```ts
// products/<slug>/tests/explore/ex-03-01.probe.ts
import { test } from '../support/session';
import { redactUrl } from '../support/redact';
test.use({ role: 'kasir' });

test('EX-03 probe 1', async ({ page }, testInfo) => {
  await page.goto('/pos');
  // the actions of this probe
  console.log(redactUrl(page.url()));
  // Never snapshot or screenshot a page while one of its fields holds a real password.
  console.log(await page.locator('body').ariaSnapshot());
  await page.screenshot({ path: testInfo.outputPath('ex-03-01.png'), fullPage: true });
});
```

A probe that types into a password field uses an obviously made-up value, never a test account's password.

Run one probe with `npx playwright test -c products/<slug> --project=probe --no-deps ex-03-01`. Read the snapshot in its output, decide the next step, and write the next probe. Keep each probe small: one to five actions.

## Running and reading results

- **Run:** `npx playwright test -c products/<slug> --project=chromium <files or folders>`. Without `--no-deps`, the `setup` project runs first and logs every role in again. Do that once at the start of a run. Later runs add `--no-deps` and reuse the saved sessions. Run `setup` again only when a role's session has ended, because every login counts against the app's rate limit.
- **State across runs.** Playwright empties `test-results/` at the start of every run. A file that must outlive a run, such as a count of logins or a note on data to restore, goes in `cycles/<cycle>/run/`, or in `.auth/` as `support/login.ts` does for its pause after a rate limit.
- **Results:** `products/<slug>/test-results.json`. Map each test to its case through the ID in the title. `passed` is PASS, `failed` and `timedOut` are FAIL candidates, `skipped` is BLOCKED or NOT RUN with its reason.
- **Evidence:** screenshots, videos and traces of failed tests are in `products/<slug>/test-results/`. Copy the ones you cite into `cycles/<cycle>/evidence/` with clear names. Never share a trace outside the workspace: it holds the session's cookies.
- **Screenshots without people.** Often a screenshot of the element alone is enough, such as a table's footer or a summary card: `await locator.screenshot({ path })`. It holds no one's data. Otherwise, a screenshot you take yourself masks what identifies a shared test account or a real person, such as the account's email, its avatar or initials, names and phone numbers: `page.screenshot({ path, mask: [page.getByText('qa@…'), page.getByRole('img', { name: 'Avatar' })] })`. While a dialog is open, the rest of the page is hidden from the accessibility tree, so a mask that uses `getByRole` misses the header behind it: mask such parts with a CSS locator, such as `page.locator('header img')`. To cover part of an image that already exists, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/samarkan.mjs <in.png> <out.png> <x,y,width,height> …` from the workspace root. It paints black boxes, in image pixels from the top-left corner.
- **Flakiness:** run a failed test twice more (`--repeat-each=3` on that test only). Failing every time is a FAIL candidate. Mixed results are INCONCLUSIVE, with the count.
