import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET, USERS } from "../data";

export function usermiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authenticationtoken = req.headers.authorization;
  if (!authenticationtoken) {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  try {
    const decoded = jwt.verify(authenticationtoken, SECRET);
    //@ts-ignore
    req.userId = decoded.userId;
    //@ts-ignore
    if (!USERS[decoded.userId]) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }
    next();
  } catch {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }
}
