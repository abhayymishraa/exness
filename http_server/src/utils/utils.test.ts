// bun test src/utils/utils.test.ts
import { expect, test } from "bun:test";
import { calculatePnlCents, PRICE_SCALE, USD_SCALE } from "./utils";

const OPEN = 650000000; // 65,000.00 on PRICE_SCALE
const MARGIN = 10000; // $100 in cents

// Floating-point reference. Independent of the BigInt implementation, so a
// regression in one shows up as disagreement rather than two matching bugs.
const reference = (
  side: "buy" | "sell",
  open: number,
  close: number,
  marginCents: number,
  lev: number,
) => {
  const p = ((close - open) / open) * (marginCents * lev);
  return side === "buy" ? p : -p;
};

test("scales are the ones every conversion assumes", () => {
  expect(PRICE_SCALE).toBe(10000);
  expect(USD_SCALE).toBe(100);
});

test("pnl agrees with the reference within a cent", () => {
  const cases: [("buy" | "sell"), number, number][] = [
    ["buy", 715000000, 10],
    ["buy", 585000000, 10],
    ["sell", 585000000, 10],
    ["sell", 715000000, 10],
    ["buy", 650000000, 100],
    ["buy", 643500000, 100],
    ["buy", 650000100, 1],
  ];
  for (const [side, close, lev] of cases) {
    const got = calculatePnlCents({
      side,
      openPrice: OPEN,
      closePrice: close,
      marginCents: MARGIN,
      leverage: lev,
    });
    expect(Math.abs(got - reference(side, OPEN, close, MARGIN, lev))).toBeLessThanOrEqual(1);
  }
});

test("a flat market returns exactly zero, not dust", () => {
  for (const lev of [1, 5, 10, 20, 100]) {
    expect(
      calculatePnlCents({
        side: "buy",
        openPrice: OPEN,
        closePrice: OPEN,
        marginCents: MARGIN,
        leverage: lev,
      }),
    ).toBe(0);
  }
});

// The invariant the liquidation price exists to guarantee: at that price the
// loss is exactly the margin, so the position returns zero equity.
test("loss equals margin exactly at the liquidation price", () => {
  for (const lev of [1, 5, 10, 20, 100]) {
    for (const side of ["buy", "sell"] as const) {
      const liq =
        side === "buy"
          ? Math.floor(OPEN * (1 - 1 / lev))
          : Math.floor(OPEN * (1 + 1 / lev));
      const pnl = calculatePnlCents({
        side,
        openPrice: OPEN,
        closePrice: liq,
        marginCents: MARGIN,
        leverage: lev,
      });
      expect(MARGIN + pnl).toBe(0);
    }
  }
});

// closeOrder marks against the CURRENT price, so a gap between two Binance
// ticks can carry the price past the liquidation level. Raw pnl then exceeds
// the margin; closeOrder clamps it. This asserts the raw figure really can
// blow through, which is what makes the clamp load-bearing.
test("a gap past liquidation would exceed the margin without a clamp", () => {
  const lev = 10;
  const liq = Math.floor(OPEN * (1 - 1 / lev));
  const gapped = Math.floor(liq * 0.8); // 20% past liquidation
  const raw = calculatePnlCents({
    side: "buy",
    openPrice: OPEN,
    closePrice: gapped,
    marginCents: MARGIN,
    leverage: lev,
  });
  expect(raw).toBeLessThan(-MARGIN);
  expect(Math.max(raw, -MARGIN)).toBe(-MARGIN);
  expect(MARGIN + Math.max(raw, -MARGIN)).toBe(0);
});

test("long and short are symmetric about the open price", () => {
  const up = calculatePnlCents({
    side: "buy", openPrice: OPEN, closePrice: 715000000, marginCents: MARGIN, leverage: 10,
  });
  const down = calculatePnlCents({
    side: "sell", openPrice: OPEN, closePrice: 715000000, marginCents: MARGIN, leverage: 10,
  });
  expect(up).toBe(-down);
});
