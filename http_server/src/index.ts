import express from "express";
import cors from "cors";
import { Client } from "pg";
import { toDisplayPrice } from "./utils";

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

app.post("/api/v1/user/signin", (req, res) => {});

app.post("/api/v1/user/signup", (req, res) => {});
app.get("/api/v1/user/balance", (req, res) => {});

app.get("/api/v1/trading/candles/:symbol", async (req, res) => {
  console.log("reached here ");
  const duration = req.query.duration;
  const symbol = req.params.symbol.toString();

  console.log(duration, symbol);

  const query = `SELECT * FROM ${duration} WHERE symbol = $1 ORDER BY bucket ASC`;

  try {
    const data = await pgClient.query(query, [symbol]);
    res.status(200).json({
      data: data.rows.map((row) => ({
        time: Math.floor(new Date(row.bucket).getTime() / 1000),
        open: toDisplayPrice(row.open),
        high: toDisplayPrice(row.high),
        low: toDisplayPrice(row.low),
        close: toDisplayPrice(row.close),#158BF9
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

app.post("/api/v1/trading/order/open/:orderID", (req, res) => {
  const query = req.query;
  const orderID = req.params;
});

app.post("/api/v1/trading/order/close/:orderID", (req, res) => {
  const query = req.query;
  const orderID = req.params;
});

app.post("/api/v1/trading/orders", (req, res) => {
  const query = req.query;
});

app.listen(port, () => {
  console.log(`App is listening on the port : ${port}`);
});
