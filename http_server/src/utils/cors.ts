// Origin allow-list matching for CORS.
//
// Entries are either an exact origin ("https://exness.abhayymishraa.us") or a
// single-label wildcard ("https://*.vercel.app"). Wildcards exist because
// Vercel mints a new hostname per preview deploy and we don't want an env
// change per branch.
//
// The wildcard spans exactly ONE label on purpose. "https://*.vercel.app" must
// match "https://exness-abc.vercel.app" but NOT "https://evil.co/.vercel.app"
// or "https://a.b.vercel.app". Credentials are enabled on this API, so a loose
// match would let another site issue authenticated requests as a signed-in user.
export function matchOrigin(allowed: string[], origin: string): boolean {
  return allowed.some((entry) => {
    const star = entry.indexOf("*");
    if (star === -1) return entry === origin;

    const head = entry.slice(0, star);
    const tail = entry.slice(star + 1);
    if (origin.length <= head.length + tail.length) return false;
    if (!origin.startsWith(head) || !origin.endsWith(tail)) return false;

    const label = origin.slice(head.length, origin.length - tail.length);
    return label.length > 0 && !label.includes(".") && !label.includes("/");
  });
}

export function parseAllowedOrigins(raw: string | undefined): string[] {
  return (raw ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
