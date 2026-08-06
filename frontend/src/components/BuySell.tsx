import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import type { SYMBOL } from "../utils/constants";
import { createTrade, findUserAmount } from "../api/trade";
import { getAssetDetails } from "../api/trade";
import type { Asset } from "../types/asset";
import {
  calculatePnlCents,
  convertoUsdPrice,
  toDisplayPriceUSD,
  toInternalPrice,
} from "../utils/utils";

// Must match http_server tradeSchema exactly. The UI previously offered 2x,
// which the server rejects with "Incorrect inputs", and hid 100x, which it
// accepts — so one button was dead and one option was unreachable.
const LEVERAGES = [1, 5, 10, 20, 100] as const;

const usd = (cents: number) =>
  toDisplayPriceUSD(cents).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BuySell({
  askPrice,
  bidPrice,
  symbol,
}: {
  askPrice: number;
  bidPrice: number;
  symbol: SYMBOL;
}) {
  const [orderType, setOrderType] = useState<"market" | "pending">("market");
  const [margin, setMargin] = useState<number>(100);
  const [leverage, setLeverage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tpEnabled, setTpEnabled] = useState<boolean>(false);
  const [slEnabled, setSlEnabled] = useState<boolean>(false);
  const [tpPrice, setTpPrice] = useState<string>("");
  const [slPrice, setSlPrice] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const getUserBalance = async () => {
      try {
        const response = await findUserAmount();
        if (response && response.usd_balance !== undefined) {
          setUserBalance(response.usd_balance);
        }
      } catch (err) {
        console.error("Error fetching user balance", err);
      }
    };

    const getAssets = async () => {
      try {
        const assetData = await getAssetDetails();
        if (assetData.length > 0) {
          const asset = assetData.find((a) => a.symbol === symbol);
          if (asset) setCurrentAsset(asset);
        }
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    };

    getUserBalance();
    getAssets();
    const balanceIntervalId = setInterval(getUserBalance, 10000);
    const assetsIntervalId = setInterval(getAssets, 30000);
    return () => {
      clearInterval(balanceIntervalId);
      clearInterval(assetsIntervalId);
    };
  }, [symbol]);

  const entry = activeTab === "buy" ? askPrice : bidPrice;

  const estimatePnl = (target: string, enabled: boolean) => {
    if (!enabled || !target || Number(target) <= 0) return 0;
    return calculatePnlCents({
      side: activeTab,
      openPrice: toInternalPrice(entry),
      closePrice: toInternalPrice(Number(target)),
      marginCents: margin * 100,
      leverage,
    });
  };

  const estimatedTpPnlInCents = useMemo(
    () => estimatePnl(tpPrice, tpEnabled),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tpEnabled, tpPrice, activeTab, askPrice, bidPrice, margin, leverage],
  );
  const estimatedSlPnlInCents = useMemo(
    () => estimatePnl(slPrice, slEnabled),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slEnabled, slPrice, activeTab, askPrice, bidPrice, margin, leverage],
  );

  // The server computes this on open; showing the same number here is the whole
  // "liquidation price upfront" promise. It replaces a hardcoded "Risk Level:
  // LOW" bar pinned at 30% width, which never moved — not even at 100x.
  const liquidation = useMemo(() => {
    // At 1x a long liquidates only at zero and a short only at +100%, i.e. not
    // in practice. Rendering "0.00 -100%" there is alarming and useless.
    if (!entry || leverage <= 1) return null;
    const price =
      activeTab === "buy" ? entry * (1 - 1 / leverage) : entry * (1 + 1 / leverage);
    return { price, movePct: 100 / leverage };
  }, [entry, leverage, activeTab]);

  const notional = margin * leverage;
  const insufficient = convertoUsdPrice(margin) > userBalance;

  const handleSubmitTrade = async () => {
    if (margin <= 0) {
      setError("Margin must be greater than 0");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (insufficient) {
      setError("Insufficient balance");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      const token = localStorage.getItem("token") || "";
      const response = await createTrade({
        symbol,
        activeTab,
        margin,
        leverage,
        tpEnabled,
        tpPrice,
        slEnabled,
        slPrice,
        token,
      });
      if (response.data && response.data.orderId) {
        setSuccess("Position opened");
        setTimeout(() => setSuccess(""), 3000);
        const balanceResponse = await findUserAmount();
        if (balanceResponse && balanceResponse.usd_balance !== undefined) {
          setUserBalance(balanceResponse.usd_balance);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to place order");
      } else {
        setError("An unexpected error occurred");
      }
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const side = activeTab === "buy" ? "long" : "short";
  const sideColor = activeTab === "buy" ? "text-long" : "text-short";

  return (
    <aside
      className="flex h-full w-full flex-col bg-surface text-ink"
      aria-label="Trade ticket"
    >
      {/* Side is the one decision that changes everything below it, so it sits
          at the top and is the only place colour is used decisively. */}
      <div className="grid shrink-0 grid-cols-2 border-b border-line">
        {(["buy", "sell"] as const).map((t) => {
          const on = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              aria-pressed={on}
              className={`py-2.5 text-[13px] font-medium transition-colors ${
                on
                  ? t === "buy"
                    ? "bg-long/12 text-long shadow-[inset_0_-2px_0_0_var(--color-long)]"
                    : "bg-short/12 text-short shadow-[inset_0_-2px_0_0_var(--color-short)]"
                  : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              {t === "buy" ? "Long" : "Short"}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Entry price: the number that matters, given room. */}
        <div className="border-b border-line px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <span className="label">{side} entry</span>
            <span className="num text-[11px] text-ink-faint">
              {currentAsset?.name ?? symbol}
            </span>
          </div>
          <p className={`num mt-1.5 text-[26px] font-medium leading-none ${sideColor}`}>
            {entry.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="num mt-2 flex gap-4 text-[11px] text-ink-faint">
            <span>bid {bidPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span>ask {askPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Margin */}
        <div className="border-b border-line px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="margin" className="label">
              Margin
            </label>
            <span className="num text-[11px] text-ink-faint">
              of ${usd(userBalance)}
            </span>
          </div>
          <div className="mt-2 flex items-stretch">
            <button
              type="button"
              aria-label="Decrease margin"
              onClick={() => setMargin((p) => Math.max(10, p - 10))}
              disabled={isSubmitting}
              className="num w-8 border border-line bg-sunken text-ink-dim transition-colors hover:text-ink disabled:opacity-40"
            >
              −
            </button>
            <div className="relative flex-1">
              <span className="num pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ink-faint">
                $
              </span>
              <input
                id="margin"
                name="margin"
                type="number"
                min={10}
                step={10}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                disabled={isSubmitting}
                aria-invalid={insufficient}
                className="field num h-full rounded-none border-x-0 py-2 pl-6 pr-2 text-[14px]"
              />
            </div>
            <button
              type="button"
              aria-label="Increase margin"
              onClick={() => setMargin((p) => p + 10)}
              disabled={isSubmitting}
              className="num w-8 border border-line bg-sunken text-ink-dim transition-colors hover:text-ink disabled:opacity-40"
            >
              +
            </button>
          </div>
          {insufficient && (
            <p className="mt-1.5 text-[11px] text-short">
              Above your balance of ${usd(userBalance)}.
            </p>
          )}
        </div>

        {/* Leverage */}
        <div className="border-b border-line px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <span className="label">Leverage</span>
            <span className="num text-[11px] text-ink-faint">
              exposure ${notional.toLocaleString("en-US")}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-px bg-line">
            {LEVERAGES.map((lev) => {
              const on = leverage === lev;
              return (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  disabled={isSubmitting}
                  aria-pressed={on}
                  className={`num py-1.5 text-[12px] font-medium transition-colors ${
                    on
                      ? "bg-accent text-[#04121f]"
                      : "bg-sunken text-ink-dim hover:text-ink"
                  }`}
                >
                  {lev}x
                </button>
              );
            })}
          </div>
        </div>

        {/* The promise the landing page makes, kept. */}
        {!liquidation && (
          <div className="flex items-baseline justify-between border-b border-line px-4 py-3">
            <span className="label">Liquidation</span>
            <span className="num text-[12px] text-ink-faint">
              none at 1x
            </span>
          </div>
        )}
        {liquidation && (
          <div className="flex items-baseline justify-between border-b border-line px-4 py-3">
            <span className="label">Liquidation</span>
            <span className="num text-right text-[13px]">
              <span className="text-short">
                {liquidation.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="ml-2 text-[11px] text-ink-faint">
                {activeTab === "buy" ? "−" : "+"}
                {liquidation.movePct.toFixed(liquidation.movePct < 10 ? 1 : 0)}%
              </span>
            </span>
          </div>
        )}

        {/* Order type */}
        <div className="border-b border-line px-4 py-3.5">
          <span className="label">Order type</span>
          <div className="mt-2 grid grid-cols-2 gap-px bg-line">
            {(["market", "pending"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                aria-pressed={orderType === t}
                className={`py-1.5 text-[12px] font-medium transition-colors ${
                  orderType === t
                    ? "bg-raised text-ink"
                    : "bg-sunken text-ink-faint hover:text-ink-dim"
                }`}
              >
                {t === "market" ? "Market" : "Limit"}
              </button>
            ))}
          </div>
        </div>

        {/* Exits */}
        {(
          [
            ["Take profit", tpEnabled, setTpEnabled, tpPrice, setTpPrice, estimatedTpPnlInCents],
            ["Stop loss", slEnabled, setSlEnabled, slPrice, setSlPrice, estimatedSlPnlInCents],
          ] as const
        ).map(([label, enabled, setEnabled, value, setValue, pnl]) => (
          <div key={label} className="border-b border-line px-4 py-3">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="label">{label}</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--color-accent)]"
              />
            </label>
            {enabled && (
              <>
                <div className="relative mt-2">
                  <span className="num pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ink-faint">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Target price"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="field num py-2 pl-6 pr-2 text-[13px]"
                  />
                </div>
                {value && (
                  <p className="num mt-1.5 flex justify-between text-[11px]">
                    <span className="text-ink-faint">estimated</span>
                    <span className={pnl >= 0 ? "text-long" : "text-short"}>
                      {pnl >= 0 ? "+" : "−"}${usd(Math.abs(pnl))}
                    </span>
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pinned so the action never scrolls out of reach. */}
      <div className="shrink-0 border-t border-line px-4 py-3">
        {error && (
          <p role="alert" className="mb-2 text-[12px] text-short">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="mb-2 text-[12px] text-long">
            {success}
          </p>
        )}
        <button
          onClick={handleSubmitTrade}
          disabled={isSubmitting || insufficient}
          className={`btn w-full py-2.5 text-[14px] ${
            activeTab === "buy"
              ? "bg-long text-[#04140c] hover:brightness-110"
              : "bg-short text-[#1a0605] hover:brightness-110"
          } disabled:opacity-45`}
        >
          {isSubmitting
            ? "Placing…"
            : `${activeTab === "buy" ? "Long" : "Short"} ${symbol} · $${notional.toLocaleString("en-US")}`}
        </button>
        <p className="mt-2 text-center text-[11px] text-ink-faint">
          {orderType === "market"
            ? `Fills now at ${entry.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`
            : "Triggers when the price meets your condition."}
        </p>
      </div>
    </aside>
  );
}
