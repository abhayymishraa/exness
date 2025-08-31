import express from "express";
import cors from "cors";
import { Client } from "pg";
import { toDisplayPrice } from "./utils";
import { userRouter } from "./router/user";
import { tradingRouter } from "./router/trading";

const pgClient = new Client({
  host: "localhost",
  port: 5433,
  user: "user",
  password: "XYZ@123",
  database: "trades_db",
});

await pgClient.connect();

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/trading", tradingRouter);

app.get("/api/v1/candles", async (req, res) => {
  console.log(" i am here ");
  const duration = req.query.ts;
  const asset = req.query.asset!.toString();
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
      return;
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
      return;
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
    console.log(data.rows);
    res.status(200).json({
      data: data.rows.map((row) => ({
        time: Math.floor(new Date(row.bucket).getTime() / 1000),
        open: toDisplayPrice(row.open),
        high: toDisplayPrice(row.high),
        low: toDisplayPrice(row.low),
        close: toDisplayPrice(row.close),
        symbol: row.symbol,
      })),
    });
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

app.listen(port, () => {
  console.log(`App is listening on the port : ${port}`);
});
