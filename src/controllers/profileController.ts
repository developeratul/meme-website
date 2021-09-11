import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";

async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (mongoose.isValidObjectId(id)) {
      const user =
        (await (
          await User.findOne({ _id: id })
        )?.populate({
          path: "memes",
          options: { sort: { time: -1 } },
          populate: { path: "author" },
        })) || null;

      if (!user) {
        res.status(404).json({ message: "User was not found" });
      } else {
        res.status(200).json({ user });
      }
    } else {
      res.status(404).json({ message: "User was not found" });
    }
  } catch (err) {
    next(err);
  }
}

export { getProfile };
