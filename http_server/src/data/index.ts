export const USERS: Record<
  string,
  { 
    email: string; 
    password: string; 
    balance: { usd_balance: number }; 
    assets: Record<string, number> 
  }
> = {};

export const SECRET = "mysupersectret";


export const ORDERS: Record<
  string,
  Record<string, { 
    type: "buy" | "sell"; 
    margin: number; 
    leverage: number;
    asset: string; 
    openPrice: number;
    timestamp: number;
  }>
> = {};


export const PRICESTORE: Record<string, { bid: number, ask: number }> = {};



export const CLOSEDORDERS: Record<
  string,
  Record<string, { 
    type: "buy" | "sell"; 
    margin: number; 
    leverage: number;
    asset: string; 
    openPrice: number;
    closePrice: number;
    pnl: number;
    timestamp: number;
    closeTimestamp: number;
  }>
> = {};
