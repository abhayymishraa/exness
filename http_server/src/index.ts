import express from "express";
import cors from "cors";
import { Client } from "pg";
import { userRouter } from "./router/user";
import { tradingRouter } from "./router/trading";
import { toDisplayPrice } from "./utils/utils";
import { RedisManager } from "./utils/redisClient";
import { CLOSEDORDERS, ORDERS, PRICESTORE, USERS } from "./data";
import { usermiddleware } from "./middleware";
import { v4 } from "uuid";
import { tradeSchema } from "./types/userschema";

const port = 5000;

export const pgClient = new Client({
  host: "localhost",
  port: 5433,
  user: "user",
  password: "XYZ@123",
  database: "trades_db",
});

await pgClient.connect();

export const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/v1/candles", async (req, res) => {
  console.log(" i am here ");
  const duration = req.query.ts;
  const asset = req.query.asset;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;

  let dbtable;
  switch (duration) {
    case "1m":
      dbtable = "candles_1m";
      break;
    case "1w":
      dbtable = "candles_1w";
      break;
    case "1d":
      dbtable = "candles_1d";
      break;
    default:
      return res.status(400).json({ message: "Invalid time duration" });
  }

  let symbol;
  switch (asset) {
    case "BTC":
      symbol = "BTCUSDT";
      break;
    case "ETH":
      symbol = "ETHUSDT";
      break;
    case "SOL":
      symbol = "SOLUSDT";
      break;
    default:
      return res.status(400).json({ message: "Invalid asset" });
  }

  console.log(dbtable, symbol, startTime, endTime);

  const query = `SELECT * FROM ${dbtable} WHERE symbol = $1 AND bucket >= $2 AND bucket <= $3 ORDER BY bucket ASC`;

  console.log(query);
  try {
    const data = await pgClient.query(query, [
      symbol,
      new Date(Number(startTime) * 1000),
      new Date(Number(endTime) * 1000),
    ]);

    const candles = data.rows.map((row) => ({
      timestamp: Math.floor(new Date(row.bucket).getTime() / 1000),
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      decimal: 4,
    }));

    res.status(200).json({ candles });
  } catch (err) {
    console.log(
      "errror from the endpoint api/v1/trading/candles/candlesId :",
      err
    );
    res.json({
      msg: "Invalid arguement",
    });
  }
});

app.post("/api/v1/trade", usermiddleware, async (req, res) => {
  try {
    const tradeschema = tradeSchema.safeParse(req.body);
    if (!tradeschema.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const { asset, type, margin, leverage } = tradeschema.data;

    //@ts-ignore
    const userid = req.userId;

    const user = USERS[userid];

    if (!user) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
    // current price with 1 percent spread
    const basePrice = PRICESTORE[asset];

    const currentprice = type === "buy" ? basePrice?.ask : basePrice?.bid;

    if (user.balance.usd_balance < margin) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    if (typeof currentprice !== "number") {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const leveragedAmount = margin * leverage;

    if (type === "buy") {
      user.balance.usd_balance -= margin;
    } else {
      user.balance.usd_balance += margin;
    }

    const orderid = v4();

    const order = {
      type,
      margin,
      leverage,
      asset,
      openPrice: currentprice as number,
      timestamp: Date.now(),
    };

    if (!ORDERS[userid]) {
      ORDERS[userid] = {};
    }

    ORDERS[userid][orderid] = order;

    return res.status(2000).json({
      orderId: orderid,
    });
  } catch (e) {
    console.log("eror while trade", e);
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
});

app.get("/api/v1/asset", async (req, res) => {
  const assetDetails = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      name: "Solana",
      symbol: "SOL",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  ];

  const responseAssets = assetDetails.map((asset) => {
    const priceData = PRICESTORE[asset.symbol];

    if (!priceData) {
      return {
        name: asset.name,
        symbol: asset.symbol,
        buyPrice: 0,
        sellPrice: 0,
        decimals: asset.decimals,
        imageUrl: asset.imageUrl,
      };
    }

    return {
      name: asset.name,
      symbol: asset.symbol,
      buyPrice: priceData?.ask, //buy price is(more one)
      sellPrice: priceData?.bid, // seel price
      decimals: asset.decimals,
      imageUrl: asset.imageUrl,
    };
  });

  res.status(200).json({ assets: responseAssets });
});

app.post("api/v1/trade/close", usermiddleware, (req, res) => {
  try {
    const { orderid } = req.body;
    //@ts-ignore
    const userid = req.userId;
    if (!ORDERS[userid] || !ORDERS[userid][orderid]) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = ORDERS[userid][orderid];
    const user = USERS[userid];

    const price = PRICESTORE[order.asset];
    if (!price || !user) {
      return res.status(411).json({
        message: "No matched asset found in price",
      });
    }
    // agar user ne buy kiya tha ask ke price me to wo bid ke price me wo order close krega
    // vice versal for sell if user ne sell kiya hai to closekrega wo current price pe jo ki added margin wla hai
    const closeprice = order.type === "buy" ? price?.bid : price?.ask;

    let pnl = 0;
    const totalamountwithleveraged = order.margin * order.leverage;
    if (order.type === "buy") {
      const pricechange = closeprice! - order.openPrice;
      pnl = pricechange / order.openPrice / totalamountwithleveraged;
    } else {
      const pricechange = order.openPrice - closeprice!;
      pnl = (pricechange / order.openPrice) * totalamountwithleveraged;
    }
    user.balance.usd_balance += order.margin + Math.round(pnl);

    if (!CLOSEDORDERS[userid]) CLOSEDORDERS[userid] = {};
    CLOSEDORDERS[userid][orderid] = {
      ...order,
      closePrice: closeprice,
      pnl: Math.round(pnl),
      closeTimestamp: Date.now(),
    };

    delete ORDERS[userid][orderid];

    return res.status(200).json({
      message: "Positio closed success",
      pnl: Math.round(pnl),
    });
  } catch (e) {
    console.log("Err", e);
    return res.status(411).json({
      message: "Something went down",
    });
  }
});

app.use("/api/v1/trades", tradingRouter);
app.use("/api/v1/user", userRouter);

async function startpriceuddate() {
  const redis = await RedisManager.getInstance();
  ["BTC", "ETH", "SOL"].forEach(async (asset) => {
    await redis.subscribe(asset, (msg: string) => {
      const data = JSON.parse(msg);
      PRICESTORE[asset] = { ask: data.ask, bid: data.bid };
    });
  });
}

startpriceuddate();

app.listen(port, () => {
  console.log(`App is listening on the port : ${port}`);
});
