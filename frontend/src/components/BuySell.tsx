"use client";

import { useState } from "react";

export default function BuySell({
  buyPrice,
  sellPrice,
  symbol,
}: {
  buyPrice: number;
  sellPrice: number;
  symbol: string;
}) {
  const [orderType, setOrderType] = useState<"market" | "pending">("market");
  const [lots, setLots] = useState<number>(1);
  const [tpEnabled, setTpEnabled] = useState<boolean>(false);
  const [slEnabled, setSlEnabled] = useState<boolean>(false);
  const [tpPrice, setTpPrice] = useState<string>("");
  const [slPrice, setSlPrice] = useState<string>("");

  const adjustLots = (delta: number) => {
    setLots((prev) => Math.max(0, Math.round((prev + delta) * 100) / 100));
  };

  return (
    <aside
      className="
        w-full max-w-sm
        rounded-xl border border-[#263136]
        bg-[#0f171b] text-white
        p-4 md:p-5
        shadow-sm h-full
      "
      aria-label="Trade ticket"
    >
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-pretty text-sm font-medium text-white/80">
            Trading Pair
          </h2>
          <span className="rounded-md border border-[#263136] bg-[#0f171b] px-2 py-1 text-xs text-white/70">
            Regular Form
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-lg font-semibold">{symbol}</div>
          <div className="text-xs text-white/50">Live quotes</div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3" aria-label="Prices">
        <div
          className="
            rounded-lg border border-[#263136] bg-[#0f171b]/70
            p-3
          "
        >
          <div className="text-xs text-white/60">Sell</div>
          <div className="mt-1 text-balance text-xl font-semibold text-[#EB483F]">
            {buyPrice}
          </div>
        </div>
        <div
          className="
            rounded-lg border border-[#263136] bg-[#0f171b]/70
            p-3
          "
        >
          <div className="text-xs text-white/60">Buy</div>
          <div className="mt-1 text-balance text-xl font-semibold text-[#158BF9]">
            {sellPrice}
          </div>
        </div>
      </section>

      <section className="mt-4" aria-label="Risk indicator">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Risk</span>
          <span className="font-medium">39%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#263136]">
          <div
            className="h-2 rounded-full bg-[#158BF9]"
            style={{ width: "39%" }}
            aria-hidden="true"
          />
        </div>
      </section>

      <nav
        className="mt-4 grid grid-cols-2 gap-2"
        role="tablist"
        aria-label="Order type"
      >
        <button
          role="tab"
          aria-selected={orderType === "market"}
          className={`rounded-lg border px-3 py-2 text-sm transition
            ${
              orderType === "market"
                ? "border-[#158BF9] bg-[#158BF9]/10 text-[#158BF9]"
                : "border-[#263136] bg-[#0f171b] text-white/70 hover:text-white"
            }`}
          onClick={() => setOrderType("market")}
        >
          Market
        </button>
        <button
          role="tab"
          aria-selected={orderType === "pending"}
          className={`rounded-lg border px-3 py-2 text-sm transition
            ${
              orderType === "pending"
                ? "border-[#158BF9] bg-[#158BF9]/10 text-[#158BF9]"
                : "border-[#263136] bg-[#0f171b] text-white/70 hover:text-white"
            }`}
          onClick={() => setOrderType("pending")}
        >
          Pending
        </button>
      </nav>

      <section className="mt-4">
        <label
          htmlFor="lots"
          className="mb-1 block text-sm font-medium text-white/80"
        >
          Volume
        </label>
        <div className="text-xs text-white/50">Lots</div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label="Decrease lots"
            className="rounded-md border border-[#263136] px-3 py-2 text-sm text-white/80 hover:bg-[#0f171b]/60"
            onClick={() => adjustLots(-0.1)}
          >
            −
          </button>
          <input
            id="lots"
            name="lots"
            type="number"
            min={0}
            step={0.01}
            value={lots}
            onChange={(e) => setLots(Number(e.target.value))}
            className="
              w-full rounded-md border border-[#263136]
              bg-[#0f171b] px-3 py-2 text-sm
              outline-none ring-0 placeholder:text-white/40
              focus:border-[#158BF9]
            "
            aria-describedby="lots-help"
          />
          <button
            type="button"
            aria-label="Increase lots"
            className="rounded-md border border[#263136] border-[#263136] px-3 py-2 text-sm text-white/80 hover:bg-[#0f171b]/60"
            onClick={() => adjustLots(0.1)}
          >
            +
          </button>
        </div>
        <p id="lots-help" className="mt-1 text-xs text-white/50">
          Adjust order size in lots.
        </p>
      </section>

      <section className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tp-toggle"
            className="text-sm font-medium text-white/80"
          >
            Take Profit
          </label>
          <input
            id="tp-toggle"
            type="checkbox"
            className="h-4 w-4 accent-[#158BF9]"
            checked={tpEnabled}
            onChange={(e) => setTpEnabled(e.target.checked)}
            aria-controls="tp-price"
            aria-expanded={tpEnabled}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="tp-price" className="sr-only">
            Take Profit Price
          </label>
          <input
            id="tp-price"
            name="tp"
            type="number"
            step="0.01"
            placeholder="Price"
            disabled={!tpEnabled}
            value={tpPrice}
            onChange={(e) => setTpPrice(e.target.value)}
            className={`
              w-full rounded-md border px-3 py-2 text-sm outline-none
              ${
                tpEnabled
                  ? "border-[#263136] bg-[#0f171b] focus:border-[#158BF9]"
                  : "border-[#263136]/40 bg-[#0f171b]/40 text-white/40"
              }
            `}
          />
        </div>
      </section>

      <section className="mt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="sl-toggle"
            className="text-sm font-medium text-white/80"
          >
            Stop Loss
          </label>
          <input
            id="sl-toggle"
            type="checkbox"
            className="h-4 w-4 accent-[#158BF9]"
            checked={slEnabled}
            onChange={(e) => setSlEnabled(e.target.checked)}
            aria-controls="sl-price"
            aria-expanded={slEnabled}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="sl-price" className="sr-only">
            Stop Loss Price
          </label>
          <input
            id="sl-price"
            name="sl"
            type="number"
            step="0.01"
            placeholder="Price"
            disabled={!slEnabled}
            value={slPrice}
            onChange={(e) => setSlPrice(e.target.value)}
            className={`
              w-full rounded-md border px-3 py-2 text-sm outline-none
              ${
                slEnabled
                  ? "border-[#263136] bg-[#0f171b] focus:border-[#158BF9]"
                  : "border-[#263136]/40 bg-[#0f171b]/40 text-white/40"
              }
            `}
          />
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="
            rounded-lg border border-[#263136]
            bg-[#0f171b]
            px-4 py-3 text-sm font-semibold
            text-[#EB483F]
            hover:bg-[#0f171b]/70
            transition
          "
          aria-label="Place sell order"
        >
          Sell
        </button>
        <button
          className="
            rounded-lg border border-[#158BF9]
            bg-[#158BF9] px-4 py-3
            text-sm font-semibold text-white
            hover:bg-[#158BF9]/90
            transition
          "
          aria-label="Place buy order"
        >
          Buy
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-white/50">
        {orderType === "market"
          ? "Instant execution at market price."
          : "Order will trigger when price meets your condition."}
      </p>
    </aside>
  );
}
