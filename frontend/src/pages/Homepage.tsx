import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import LiveTicker from "../components/LiveTicker";
import Reveal from "../components/Reveal";
import { NumberTicker } from "../components/magicui/number-ticker";
import { FlickeringGrid } from "../components/magicui/flickering-grid";
import { Signalingmanager } from "../utils/subscription_manager";
import { toDisplayPrice } from "../utils/utils";
import type { Trade } from "../components/AskBidsTable";

/**
 * Landing page. Precision-instrument language, dark-locked (the product is a
 * terminal). The hero visual is the real feed, the storytelling images are our
 * generated clay-diorama world (prompted with these exact brand tokens), and
 * the product shot is a genuine screenshot of the live terminal.
 */

/**
 * NumberTicker springs toward its value and has no reduced-motion branch of its
 * own, so render the settled figure directly when motion is not wanted.
 */
function Stat({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <>
        {value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </>
    );
  }
  return <NumberTicker value={value} decimalPlaces={decimals} />;
}

/** Live liquidation preview: BTC at 10x, driven by the same feed. */
function LiveLiquidation() {
  const [bid, setBid] = useState(0);
  useEffect(() => {
    const manager = Signalingmanager.getInstance();
    return manager.watch("BTC", (t: Trade) => setBid(toDisplayPrice(t.bidPrice)));
  }, []);
  const liq = bid * (1 - 1 / 10);
  return (
    <p className="num mt-3 text-[26px] font-medium leading-none text-short">
      {bid > 0 ? (
        liq.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      ) : (
        <span className="inline-block h-7 w-32 animate-pulse rounded-sm bg-raised align-middle" />
      )}
    </p>
  );
}

const JOURNEY = [
  {
    img: "/img/world-1.webp",
    alt: "Clay model of an open pavilion streaming blue threads of market data",
    span: "lg:col-span-5",
    title: "The feed",
    body: "Binance spot trades stream in over WebSocket, tick by tick.",
  },
  {
    img: "/img/world-2.webp",
    alt: "Clay model of a geared engine room turning blue threads into candle blocks",
    span: "lg:col-span-4",
    title: "The engine room",
    body: "TimescaleDB rolls the raw ticks into candles as they arrive.",
  },
  {
    img: "/img/world-3.webp",
    alt: "Clay model of a trading desk with a curved chart wall and warm lamp",
    span: "lg:col-span-3",
    title: "The desk",
    body: "You trade against the same feed you watch.",
  },
];

export default function ExnessLanding() {
  const reduce = useReducedMotion();

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

        <main id="main">
          <section className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <h1
                className="rise text-[clamp(2.5rem,5.5vw,4rem)] font-semibold"
                style={{ animationDelay: "40ms" }}
              >
                Leverage, without the ceremony.
              </h1>
              <p
                className="rise mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink-dim"
                style={{ animationDelay: "120ms" }}
              >
                Two clicks to a position. Stop, target and liquidation price are
                computed before you confirm.
              </p>
              <div
                className="rise mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "200ms" }}
              >
                <Link to="/signup" className="btn btn-primary px-6 py-3">
                  Open account
                </Link>
                <Link to="/trading" className="btn btn-ghost px-6 py-3">
                  Try the terminal
                </Link>
              </div>
            </div>

            <div className="rise relative" style={{ animationDelay: "300ms" }}>
              {/* Ambient data-field behind the live panel. Motivated: it is the
                  visual of ticks arriving. Hidden under reduced motion; the
                  static masked grid beneath still reads. */}
              {!reduce && (
                <FlickeringGrid
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_40%,#000_30%,transparent_75%)]"
                  squareSize={3}
                  gridGap={7}
                  color="#158bf9"
                  maxOpacity={0.16}
                  flickerChance={0.08}
                />
              )}
              <LiveTicker />
            </div>
          </section>

          <section className="border-t border-line py-16 sm:py-20">
            <Reveal>
              <h2 className="max-w-[24ch] text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold">
                From raw feed to filled order.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
              {JOURNEY.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.09} className={step.span}>
                  <img
                    src={step.img}
                    alt={step.alt}
                    loading="lazy"
                    className="w-full rounded-[4px]"
                  />
                  <h3 className="mt-4 text-[15px] font-semibold">{step.title}</h3>
                  <p className="mt-1.5 max-w-[38ch] text-[13px] leading-relaxed text-ink-dim">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="border-t border-line py-16 sm:py-20">
            <Reveal>
              <h2 className="max-w-[26ch] text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold">
                Real mechanics, demo stakes.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-px bg-line lg:grid-cols-12">
              <Reveal className="bg-surface p-5 lg:col-span-7">
                <img
                  src="/img/terminal.webp"
                  alt="The Exness terminal: order book, live candles and an open BTC long with its liquidation price"
                  loading="lazy"
                  className="w-full rounded-[4px] border border-line"
                />
                <p className="mt-4 text-[13px] leading-relaxed text-ink-dim">
                  The terminal, as it runs: live book, exchange-style candles,
                  one-click positions.
                </p>
              </Reveal>

              <div className="grid gap-px bg-line lg:col-span-5">
                <Reveal
                  delay={0.06}
                  className="relative overflow-hidden bg-surface p-5"
                >
                  <img
                    src="/img/world-4.webp"
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="pointer-events-none absolute -right-8 -top-2 w-44 opacity-45"
                  />
                  <h3 className="text-[15px] font-semibold">
                    Liquidation, before you commit.
                  </h3>
                  <p className="mt-1.5 max-w-[30ch] text-[13px] leading-relaxed text-ink-dim">
                    A BTC long at 10x would liquidate at, right now:
                  </p>
                  <LiveLiquidation />
                  <p className="num mt-3 text-[11px] text-ink-faint">
                    entry x (1 - 1/leverage)
                  </p>
                </Reveal>

                <Reveal
                  delay={0.12}
                  className="bg-surface bg-gradient-to-br from-accent-sunk/25 to-transparent p-5"
                >
                  <dl className="grid grid-cols-3 gap-4">
                    <div>
                      <dt className="label">Spread</dt>
                      <dd className="num mt-2 text-xl font-medium">
                        <Stat value={0.02} decimals={2} />%
                      </dd>
                    </div>
                    <div>
                      <dt className="label">Leverage</dt>
                      <dd className="num mt-2 text-xl font-medium">
                        <Stat value={100} />x
                      </dd>
                    </div>
                    <div>
                      <dt className="label">Demo bal.</dt>
                      <dd className="num mt-2 text-xl font-medium">
                        $<Stat value={5000} />
                      </dd>
                    </div>
                  </dl>
                </Reveal>

                <Reveal delay={0.18} className="bg-surface p-5">
                  <h3 className="text-[15px] font-semibold">
                    Candles the way venues draw them.
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">
                    Trade-priced, exchange-time buckets, in-progress candle
                    included. The same kline model Binance streams.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="grid items-center gap-10 border-t border-line py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold">
                Start with a $5,000 demo balance.
              </h2>
              <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-dim">
                No card, no deposit. Positions mark against live prices, and no
                real funds ever move.
              </p>
              <div className="mt-8">
                <Link to="/signup" className="btn btn-primary px-6 py-3">
                  Open account
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <img
                src="/img/world-5.webp"
                alt="Clay model of a quiet terminus where a blue thread settles into a bowl beside stacked green and red discs"
                loading="lazy"
                className="mx-auto w-full max-w-md rounded-[4px]"
              />
            </Reveal>
          </section>
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
