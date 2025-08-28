import express from "express";
import cors from "cors";
import { Client } from "pg";

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

  const query = `SELECT * FROM ${duration} WHERE symbol = $1 ORDER BY bucket DESC`;

  try {
    const data = await pgClient.query(query, [symbol]);
    console.log(data);

    res.status(200).json({
      data: data.rows.map((row) => {
        return {
          symbol: row.symbol,
          bucket: row.bucket,
          open: row.open,
          hight: row.high,
          low: row.low,
          close: row.close,
        };
      }),
      symbol,
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
