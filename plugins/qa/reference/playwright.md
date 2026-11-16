# Writing and running Playwright tests

The `penguji` and `pemeriksa` agents follow this file. Run everything from the workspace root.

## Layout

```
products/<slug>/tests/
  auth.setup.ts              logs in once per role (stage 1)
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

  The fixture writes the session back after every test, because many apps rotate their refresh token and log out a second test that starts from the same old file. A test that logs out sets `test.use({ saveSession: false })`. Never log in inside a spec with a username and password. A case that needs a role without a session is BLOCKED.
- **Server-rendered pages.** Before filling a form, wait for a sign that the page's own script has run, as `auth.setup.ts` does with its ready check. A form used before it hydrates submits natively and loses its input.
- **URLs in output.** Print or log a URL only through `redactUrl` from `support/redact.ts`. A URL can carry a password, a token or a one-time code in its query.
- **Locators,** in this order: `getByRole` with the accessible name, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`. CSS or XPath only when nothing else works, with a comment that says why.
- **Waiting.** Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`). Never use `page.waitForTimeout`, and never wait for `networkidle`.
- **Assertions prove the business outcome.** A URL or a title alone proves nothing. After an action that saves data, read it back: reload the list, open the record, or call the API, and assert the stored values. Where roles matter, check it as the other role too.
- **Data.** Every value that creates a record carries `testDataPrefix`, plus something unique, such as `QA-AUTO cuti ${Date.now()}`. Never touch a record without the prefix, except to read it.
- **No retries and no skipped assertions.** Never add `retries`, `test.fixme` or a looser assertion to make a test pass. When the expected result itself is in doubt, it is a question for the product team, not a reason to change the test.

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
  console.log(await page.locator('body').ariaSnapshot());
  await page.screenshot({ path: testInfo.outputPath('ex-03-01.png'), fullPage: true });
});
```

Run one probe with `npx playwright test -c products/<slug> --project=probe ex-03-01`. Read the snapshot in its output, decide the next step, and write the next probe. Keep each probe small: one to five actions.

## Running and reading results

- **Run:** `npx playwright test -c products/<slug> --project=chromium <files or folders>`. The `setup` project runs first and refreshes the sessions.
- **Results:** `products/<slug>/test-results.json`. Map each test to its case through the ID in the title. `passed` is PASS, `failed` and `timedOut` are FAIL candidates, `skipped` is BLOCKED or NOT RUN with its reason.
- **Evidence:** screenshots, videos and traces of failed tests are in `products/<slug>/test-results/`. Copy the ones you cite into `cycles/<cycle>/evidence/` with clear names. Never share a trace outside the workspace: it holds the session's cookies.
- **Flakiness:** run a failed test twice more (`--repeat-each=3` on that test only). Failing every time is a FAIL candidate. Mixed results are INCONCLUSIVE, with the count.
