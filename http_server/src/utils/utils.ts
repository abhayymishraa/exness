import type { CookieOptions } from "express";

export const PRICE_SCALE = 10000;
export const USD_DECIMALS = 2;
export const USD_SCALE = 100;

export function toDisplayPrice(intPrice: number): number {
  return intPrice / PRICE_SCALE;
}

  export function toInternalPrice(price: number): number {
    return Math.round(price * PRICE_SCALE);
  }

export function toDisplayUSD(intUSD: number): number {
  return intUSD / USD_SCALE;
}

export function toInternalUSD(usd: number): number {
  return Math.round(usd * USD_SCALE);
}


export function getCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";

  return {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".exness.elevenai.xyz" : undefined,
  };
}