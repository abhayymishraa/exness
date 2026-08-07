import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BorderBeam } from "./magicui/border-beam";
import { Signalingmanager } from "../utils/subscription_manager";
import { toDisplayPrice } from "../utils/utils";
import type { SYMBOL } from "../utils/constants";
import type { Trade } from "./AskBidsTable";

const SYMBOLS: SYMBOL[] = ["BTC", "ETH", "SOL"];

type Row = { bid: number; ask: number; dir: "up" | "down" | null };

/**
 * The landing page's proof of life: it subscribes to the same feed the
 * terminal uses, so the numbers a visitor sees are the ones they would trade
 * against a second later. The status dot reflects real state, green only once
 * data has actually arrived.
 */
export default function LiveTicker() {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const prev = useRef<Record<string, number>>({});
  const reduce = useReducedMotion();
  const live = Object.keys(rows).length > 0;

  useEffect(() => {
    const manager = Signalingmanager.getInstance();
    const unsubs = SYMBOLS.map((symbol) =>
      manager.watch(symbol, (t: Trade) => {
        const bid = toDisplayPrice(t.bidPrice);
        const last = prev.current[symbol];
        prev.current[symbol] = bid;
        setRows((r) => ({
          ...r,
          [symbol]: {
            bid,
            ask: toDisplayPrice(t.askPrice),
            dir:
              last === undefined || bid === last
                ? null
                : bid > last
                  ? "up"
                  : "down",
          },
        }));
      }),
    );
    return () => unsubs.forEach((off) => off());
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Live market</span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "bg-long" : "bg-ink-faint"}`}
          />
          {live ? "streaming" : "connecting"}
        </span>
      </div>

      <ul className="relative grid grid-cols-3 divide-x divide-line border-y border-line">
        {/* Tied to real state: the beam traces the panel only while ticks are
            actually arriving, so it reads as a signal rather than decoration.
            The registry component has no reduced-motion branch of its own. */}
        {live && !reduce && (
          <BorderBeam
            size={90}
            duration={7}
            colorFrom="#158bf9"
            colorTo="transparent"
            borderWidth={1}
          />
        )}
        {SYMBOLS.map((symbol) => {
          const row = rows[symbol];
          return (
            <li key={symbol} className="px-3 py-4 sm:px-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="label">{symbol}</span>
                {row?.dir && (
                  <span
                    aria-hidden
                    className={`text-[10px] leading-none ${
                      row.dir === "up" ? "text-long" : "text-short"
                    }`}
                  >
                    {row.dir === "up" ? "▲" : "▼"}
                  </span>
                )}
              </div>

              {row ? (
                <p
                  className={`num mt-2 text-lg font-medium tabular-nums transition-colors duration-500 sm:text-xl ${
                    row.dir === "up"
                      ? "text-long"
                      : row.dir === "down"
                        ? "text-short"
                        : "text-ink"
                  }`}
                >
                  {row.bid.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              ) : (
                /* Skeleton shaped like the number it replaces, not a spinner. */
                <div
                  className="mt-2 h-7 w-24 animate-pulse rounded-sm bg-raised"
                  aria-label={`Loading ${symbol} price`}
                />
              )}

              <p className="num mt-1 whitespace-nowrap text-[11px] text-ink-faint">
                {row
                  ? `ask ${row.ask.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : " "}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
        Straight off the terminal's own WebSocket.
      </p>
    </div>
  );
}
