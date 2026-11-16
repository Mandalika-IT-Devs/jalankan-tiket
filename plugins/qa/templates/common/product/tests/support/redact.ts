// Keeps secrets out of test output. A URL is printed only through redactUrl, never raw.
// Made by the qa plugin of the jalankan-tiket kit.

/** The URL with its user info removed and every query value replaced by REDACTED. */
export function redactUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.username = '';
    url.password = '';
    for (const key of [...url.searchParams.keys()]) url.searchParams.set(key, 'REDACTED');
    return url.toString();
  } catch {
    return '<unreadable URL>';
  }
}

/** True when the URL holds one of the secrets, plain or URL-encoded. */
export function urlHasSecret(raw: string, secrets: (string | undefined)[]): boolean {
  return secrets.some((s) => !!s && (raw.includes(s) || raw.includes(encodeURIComponent(s))));
}
