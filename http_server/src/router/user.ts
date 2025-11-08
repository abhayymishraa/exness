import Router from "express";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middleware/errorHandler";
import { v5 } from "uuid";
import jwt from "jsonwebtoken";
import { SECRET, USERS } from "../data";
import { credentailSchma } from "../types/userschema";
import { usermiddleware } from "../middleware";
import { getCookieOptions, toInternalUSD } from "../utils/utils";
export const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseduserinfo = credentailSchma.safeParse(req.body);

    if (!parseduserinfo.success) {
      return next(new CustomError("Error while signing up", 400, "SIGNUP_FAILED"));
    }

    const { email, password } = parseduserinfo.data;
    const uuid = v5(email, "f0e1d2c3-b4a5-6789-9876-543210fedcba");
    if (USERS[uuid]) {
      return next(new CustomError("Error while signing up", 400, "SIGNUP_FAILED"));
    }

    USERS[uuid] = {
      email: email,
      password: password,
      assets: {},
      balance: {
        usd_balance: toInternalUSD(5000), // decimals 2
      },
    };
    return res.status(200).json({
      userId: uuid,
    });
  } catch (error) {
    console.error("Signup error:", error);
    next(new CustomError("Signup failed", 500, "INTERNAL_SERVER_ERROR"));
  }
    return res.status(403).json({
      message: "Error while signing up",
    });
  }
});

userRouter.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = credentailSchma.safeParse(req.body);
    if (!parsedData.success) {
      return next(new CustomError("Incorrect credential", 400, "INVALID_CREDENTIALS"));
    }
    const { email, password } = parsedData.data;

    const uuid = v5(email, "f0e1d2c3-b4a5-6789-9876-543210fedcba");
    if (!USERS[uuid] || USERS[uuid].password !== password) {
      return next(new CustomError("Incorrect credential", 400, "INVALID_CREDENTIALS"));
    }

    const token = jwt.sign({ userId: uuid }, SECRET);
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    next(new CustomError("Signin failed", 500, "INTERNAL_SERVER_ERROR"));
  }
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

userRouter.get("/balance", usermiddleware, (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const userid = req.userId;
  try {
    return res.status(200).json({
      usd_balance: USERS[userid]!.balance.usd_balance,
    });
  } catch (error) {
    console.error("Get balance error:", error);
    next(new CustomError("Failed to retrieve balance", 500, "INTERNAL_SERVER_ERROR"));
  }
});
