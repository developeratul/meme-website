import { NextFunction, Request, Response } from "express";
import Meme from "../models/meme";
import { User } from "../models/user";
import cloudinary from "../utils/cloudinary";

async function createMeme(req: any, res: Response, next: NextFunction) {
  try {
    const { title, image } = req.body;
    const user: User = req.user;

    const photoUrl = await cloudinary.uploader.upload(image, {
      folder: `meme-site/${user.name}`,
    });

    const newMeme = new Meme({
      title,
      photoUrl: photoUrl.secure_url,
      photoId: photoUrl.public_id,
      author: user._id,
    });

    await newMeme.save();

    res.status(200).json({ message: "Meme posted" });
  } catch (err) {
    next(err);
  }
}

export { createMeme };