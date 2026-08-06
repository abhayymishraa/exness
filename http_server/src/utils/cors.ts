// Entries are exact origins, or a single-label wildcard ("https://*.vercel.app")
// so Vercel preview deploys don't need an env change per branch. The wildcard
// spans exactly ONE label: credentials are enabled, so a looser match would let
// another site issue authenticated requests as a signed-in user. See cors.test.ts.
export function matchOrigin(allowed: string[], origin: string): boolean {
  return allowed.some((entry) => {
    const star = entry.indexOf("*");
    if (star === -1) return entry === origin;

    const head = entry.slice(0, star);
    const tail = entry.slice(star + 1);
    if (!origin.startsWith(head) || !origin.endsWith(tail)) return false;

    const label = origin.slice(head.length, origin.length - tail.length);
    return label.length > 0 && !label.includes(".") && !label.includes("/");
  });
}
