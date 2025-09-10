export const PRECISION = 10000;
export const USD_PRECISION = 100;

export function toDisplayPrice(intPrice: number) {
  return Number.parseFloat((intPrice / PRECISION).toFixed(2));
}

export function toInternalPrice(price: number): number {
  return Math.round(price * PRECISION);
}

export function getPrecisedData(val: string) {
  return Math.round(parseFloat(val) * PRECISION);
}

export function getRealValue(val: number) {
  return val / PRECISION;
}

export function toDisplayPriceUSD(val: number) {
  return val / USD_PRECISION;
}

export function convertoUsdPrice(val: number) {
  return Math.round(val * USD_PRECISION);
}
export function toDissplayPrice(price: number): number {
  return price / 10000; 
}
export function toDissplayPriceUSD(price: number): number {
  return price / 100;
}

// Add this exact function from your backend:
export function calculatePnlCents({
  side,
  openPrice,
  closePrice,
  marginCents,
  leverage,
}: {
  side: "buy" | "sell";
  openPrice: number;
  closePrice: number;
  marginCents: number;
  leverage: number;
}): number {
  // Use 'n' to signify BigInt literals
  const MONEY_SCALE = 100n;
  const PRICE_SCALE = 10000n;
  const CONVERSION_FACTOR = PRICE_SCALE / MONEY_SCALE;

  // Convert all numbers to BigInt for safe integer arithmetic
  const openP = BigInt(openPrice);
  const closeP = BigInt(closePrice);
  const margin = BigInt(marginCents);
  const lev = BigInt(leverage);

  // Scale margin to the same precision as the price
  const marginOnPriceScale = margin * CONVERSION_FACTOR;
  const totalPositionValue = marginOnPriceScale * lev;

  // Perform the core calculation with BigInts
  let pnlOnPriceScale = ((closeP - openP) * totalPositionValue) / openP;
  
  // For a short position, profit is made when the price goes down
  if (side === "sell") {
    pnlOnPriceScale = -pnlOnPriceScale;
  }
  
  // Scale the final P&L back down to cents
  const finalPnl = pnlOnPriceScale / CONVERSION_FACTOR;
  
  return Number(finalPnl);
}