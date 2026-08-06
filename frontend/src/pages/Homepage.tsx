import { Link } from "react-router-dom";
import LiveTicker from "../components/LiveTicker";

/**
 * Landing page. Reads as an instrument panel rather than a marketing page:
 * hairline rules instead of cards, one accent, mono reserved for figures, and
 * a live feed where the hero illustration would normally sit.
 */
export default function ExnessLanding() {
  return (
    <div className="min-h-dvh bg-base text-ink">
      <div aria-hidden className="grid-field pointer-events-none fixed inset-0" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-5 sm:px-8">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-[#04121f]"
        >
          Skip to content
        </a>

        <header className="flex items-center justify-between border-b border-line py-5">
          <Link to="/" className="flex items-baseline gap-2.5">
            <span className="grid h-6 w-6 place-items-center bg-accent text-[13px] font-bold text-[#04121f]">
              E
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Exness</span>
          </Link>

          {/* Secondary links collapse below sm — at 390px all three wrapped and
              collided with the wordmark. */}
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/trading"
              className="hidden px-3 py-1.5 text-ink-dim transition-colors hover:text-ink sm:block"
            >
              Terminal
            </Link>
            <Link
              to="/signin"
              className="whitespace-nowrap px-3 py-1.5 text-ink-dim transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary ml-1 whitespace-nowrap px-4 py-1.5 text-sm sm:ml-2"
            >
              Open account
            </Link>
          </nav>
        </header>

        <main id="main" className="flex flex-1 flex-col justify-center py-12 sm:py-16">
          {/* Asymmetric: headline left, live data rail right — instead of the
              centred hero over three equal cards. */}
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <p className="label rise" style={{ animationDelay: "40ms" }}>
                BTC · ETH · SOL — marked to Binance spot
              </p>

              <h1
                className="rise mt-5 text-[clamp(2.5rem,5.5vw,4rem)] font-semibold"
                style={{ animationDelay: "100ms" }}
              >
                Leverage, without the ceremony.
              </h1>

              <p
                className="rise mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-dim"
                style={{ animationDelay: "170ms" }}
              >
                Open a position in two clicks. Fills are priced off the live
                Binance book, and your stop, target and liquidation level are
                calculated before you confirm — not after.
              </p>

              <div
                className="rise mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "240ms" }}
              >
                <Link to="/signup" className="btn btn-primary px-6 py-3">
                  Open an account
                </Link>
                <Link to="/trading" className="btn btn-ghost px-6 py-3">
                  Try the terminal
                </Link>
              </div>

              <p
                className="rise mt-5 text-[13px] text-ink-faint"
                style={{ animationDelay: "300ms" }}
              >
                Demo balance of $5,000. No card, no deposit.
              </p>
            </div>

            <div className="rise" style={{ animationDelay: "360ms" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="label">Live market</span>
                <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-long" />
                  streaming
                </span>
              </div>
              <LiveTicker />
              <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
                Streaming over the same WebSocket the terminal uses.
              </p>
            </div>
          </div>

          {/* Grid gap-px over a line-coloured background: the dividers ARE the
              gaps, so no borders or shadows are needed per cell. */}
          <ul className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              {
                k: "Margin and leverage, separately",
                d: "Size the position and pick the multiplier independently, so exposure is never a guess.",
              },
              {
                k: "Liquidation price upfront",
                d: "The level your position closes at is computed and shown before you open it.",
              },
              {
                k: "Candles from trades",
                d: "One-minute bars aggregate continuously off the trade stream rather than sampling on request.",
              },
            ].map((f) => (
              <li key={f.k} className="bg-surface p-6">
                <h2 className="text-[15px] font-semibold text-ink">{f.k}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{f.d}</p>
              </li>
            ))}
          </ul>
        </main>

        <footer className="flex flex-col gap-3 border-t border-line py-7 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demo platform. Positions mark against live prices, but no real funds
            are traded.
          </p>
          <div className="flex gap-5">
            <Link to="/signin" className="transition-colors hover:text-ink-dim">
              Sign in
            </Link>
            <Link to="/trading" className="transition-colors hover:text-ink-dim">
              Terminal
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
