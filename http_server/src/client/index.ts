import { Client } from "pg";
import { RedisManager } from "../utils/redisClient";

export const pgClient = new Client({
  host: "localhost",
  port: 5433,
  user: "user",
  password: "XYZ@123",
  database: "trades_db",
}).connect();

export const redis = await RedisManager.getInstance();
