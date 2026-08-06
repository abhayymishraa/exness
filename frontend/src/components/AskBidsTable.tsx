import { useEffect, useRef, useState } from "react";
import { type SYMBOL } from "../utils/constants";
import { toDisplayPrice } from "../utils/utils";
import { subscribePrices, type LivePrices } from "../utils/price_store";

export interface Trade {
  bidPrice: number;
  askPrice: number;
  symbol: SYMBOL;
}

const SYMBOLS = ["BTC", "ETH", "SOL"] as const;
type Sym = (typeof SYMBOLS)[number];

type Quote = { bid: number; ask: number; dir: "up" | "down" | null };
const EMPTY: Record<Sym, Quote> = {
  BTC: { bid: 0, ask: 0, dir: null },
  ETH: { bid: 0, ask: 0, dir: null },
  SOL: { bid: 0, ask: 0, dir: null },
};

export default function AskBids({ symbol }: { symbol?: SYMBOL }) {
  const [quotes, setQuotes] = useState<Record<Sym, Quote>>(EMPTY);
  const prev = useRef<Record<string, number>>({});

  useEffect(() => {
    // The previous version stored the ask under `bids` and the bid under
    // `asks`, then swapped them back in the markup. It rendered correctly by
    // accident and would mislead anyone touching either half.
    const unsubscribe = subscribePrices((prices: LivePrices) => {
      setQuotes((current) => {
        const next = { ...current };
        for (const s of SYMBOLS) {
          const bid = toDisplayPrice(prices[s].bid);
          const last = prev.current[s];
          prev.current[s] = bid;
          next[s] = {
            bid,
            ask: toDisplayPrice(prices[s].ask),
            dir:
              last === undefined || bid === last ? null : bid > last ? "up" : "down",
          };
        }
        return next;
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-line">
          <th className="label px-2.5 py-2 text-left font-medium">Symbol</th>
          <th className="label px-2.5 py-2 text-right font-medium">Bid</th>
          <th className="label px-2.5 py-2 text-right font-medium">Ask</th>
        </tr>
      </thead>
      <tbody>
        {SYMBOLS.map((s) => {
          const q = quotes[s];
          const active = symbol === s;
          return (
            <tr
              key={s}
              aria-current={active ? "true" : undefined}
              className={`border-b border-line/60 transition-colors ${
                active ? "bg-raised" : "hover:bg-raised/50"
              }`}
            >
              <th scope="row" className="px-2.5 py-2.5 text-left">
                <span
                  className={`num text-[13px] font-medium ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  {s}
                </span>
                <span className="num ml-1 text-[10px] text-ink-faint">USDT</span>
              </th>
              <td
                className={`num px-2.5 py-2.5 text-right text-[13px] tabular-nums transition-colors duration-500 ${
                  q.dir === "up"
                    ? "text-long"
                    : q.dir === "down"
                      ? "text-short"
                      : "text-ink-dim"
                }`}
              >
                {q.bid ? q.bid.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
              </td>
              <td className="num px-2.5 py-2.5 text-right text-[13px] text-ink-dim tabular-nums">
                {q.ask ? q.ask.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
