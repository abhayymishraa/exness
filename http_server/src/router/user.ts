import Router from "express";
import { v5 } from "uuid";
import jwt from "jsonwebtoken";
import { SECRET, USERS } from "../data";
import { credentailSchma } from "../types/userschema";
import { usermiddleware } from "../middleware";
import { toInternalUSD } from "../utils/utils";
import { saveUser } from "../store";
export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const parseduserinfo = credentailSchma.safeParse(req.body);

    if (!parseduserinfo.success) {
      return res.status(403).json({
        message: "Error while signing up",
      });
    }

    const { email, password } = parseduserinfo.data;
    const uuid = v5(email, "f0e1d2c3-b4a5-6789-9876-543210fedcba");
    if (USERS[uuid]) {
      return res.status(403).json({
        message: "Error while signing up",
      });
    }

    // argon2id, built into Bun. The DB is durable now, so a plaintext column
    // would be a permanent leak rather than one that dies with the process.
    const hashed = await Bun.password.hash(password);
    const balance = toInternalUSD(5000); // decimals 2

    USERS[uuid] = {
      email: email,
      password: hashed,
      assets: {},
      balance: { usd_balance: balance },
    };
    await saveUser(uuid, email, hashed, balance);

    return res.status(200).json({
      userId: uuid,
    });
  } catch {
    return res.status(403).json({
      message: "Error while signing up",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const parsedData = credentailSchma.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(403).json({
        message: "Incorrect credential",
      });
    }
    const { email, password } = parsedData.data;

    const uuid = v5(email, "f0e1d2c3-b4a5-6789-9876-543210fedcba");
    const user = USERS[uuid];
    if (!user || !(await Bun.password.verify(password, user.password))) {
      return res.status(403).json({
        message: "Incorrect credential",
      });
    }

    const token = jwt.sign({ userId: uuid }, SECRET);
    return res.status(200).json({
      token: token,
    });
  } catch {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

userRouter.get("/balance", usermiddleware, (req, res) => {
  //@ts-ignore
  const userid = req.userId;
  return res.status(200).json({
    usd_balance: USERS[userid]!.balance.usd_balance,
  });
});
