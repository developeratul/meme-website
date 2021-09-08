import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

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
    res.status(200).json({ message: "We have created an account for you!", user: newUser });
  } catch (err: any) {
    next({ status: 500, message: err.message });
  }
}

async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) || null;

    if (!user) {
      res.status(400).json({ message: "Your account doesn't exists" });
    } else {
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        const authToken = await user.generateWebToken();

        res.cookie("jwt", authToken, { maxAge: 2592000000 });
        res.status(200).json({ message: `Welcome back ${user.name}`, user });
      }
    }
  } catch (err: any) {
    next({ message: err.message || err });
  }
}

function checkAuth(req: any, res: Response, next: NextFunction) {
  try {
    const { user } = req;
    res.status(200).json({ user });
  } catch (err: any) {
    next({ message: err.message || err });
  }
}

async function logout(req: any, res: Response, next: NextFunction) {
  try {
    req.user.tokens = req.user.tokens.filter(({ token }: { token: string }) => token !== req.token);
    res.clearCookie("jwt");
    await req.user.save();
    res.status(200).json({ message: `Logged out as ${req.user.name}` });
  } catch (err: any) {
    next({ message: err.message || err });
  }
}

export { singnup, signin, checkAuth, logout };
