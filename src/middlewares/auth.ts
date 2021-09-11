import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

async function auth(req: any | Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwt;
    const verifiedToken: any = jwt.verify(token, `${process.env.JWT_SECRET}`);

    const user = (await User.findOne({ _id: verifiedToken.id })) || null;

    if (!user) {
      throw new Error("User was not found");
    }

    req.token = token;
    req.user = user;
    req.user.id = user._id;

    next();
  } catch (err: any) {
    res.status(401).json({ message: "You must be logged in", status: "Unauthorized" });
  }
}

export default auth;
