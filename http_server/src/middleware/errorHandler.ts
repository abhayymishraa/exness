import type { NextFunction, Request, Response } from 'express';

export class CustomError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  // Handle unexpected errors
  console.error(err);
  return res.status(500).json({
    message: 'Internal Server Error',
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};
