import { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next({ status: 404, message: "Your requested route was not found" });
}

interface Error {
  message: string;
  status: number;
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next("There was an unexpected error");
  } else {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message || err });
  }
}
