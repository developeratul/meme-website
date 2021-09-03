import { Request, Response, NextFunction } from "express";

import User from "../models/user";

async function singnup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, portfolio } = req.body;

    const emailExists = (await User.findOne({ email })) || null;

    if (emailExists) {
      res.status(400).json({ message: "email already exists" });
    }

    const newUser = new User({ name, email, password, portfolio });
    const authToken = await newUser.generateWebToken(); // generating web token

    await newUser.save();

    res.cookie("jwt", authToken, { maxAge: 2592000000 });
    res.status(200).json({ message: "We have created an account for you!" });
  } catch (err: any) {
    next({ status: 500, message: err.message });
  }
}

export { singnup };
