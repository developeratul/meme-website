import { NextFunction, Request, Response } from "express";
import Meme from "../models/meme";
import { User } from "../models/user";
import UserModel from "../models/user";
import cloudinary from "../utils/cloudinary";

async function createMeme(req: any, res: Response, next: NextFunction) {
  try {
    const { title } = req.body;
    const user: User = req.user;
    const image = req.file.path;

    const photoUrl = await cloudinary.uploader.upload(image, {
      folder: `meme-site/${user.name}`,
    });

    const newMeme = new Meme({
      title,
      photoUrl: photoUrl.secure_url,
      photoId: photoUrl.public_id,
      author: user._id,
      time: Date.now(),
    });

    await UserModel.updateOne({ _id: user._id }, { $push: { memes: newMeme } });

    const meme = await (await newMeme.save()).populate("author");

    res.status(200).json({ message: "Meme posted", meme });
  } catch (err) {
    next(err);
  }
}

async function getMemes(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = req.query;

    if (search) {
      const memes =
        (await Meme.find({ title: { $regex: `${search}`, $options: "gi" } })
          .populate("author")
          .sort({ time: -1 })) || [];

      res.status(200).json({ memes });
    } else {
      await Meme.find({})
        .populate("author")
        .sort({ time: -1 })
        .exec((err, memes) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ memes });
          }
        });
    }
  } catch (err) {
    next(err);
  }
}

async function like(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId } = req.body;
    const user: User = req.user;

    await Meme.updateOne({ _id: memeId }, { $push: { likes: user._id } });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function unlike(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId } = req.body;
    const user: User = req.user;

    await Meme.updateOne({ _id: memeId }, { $pull: { likes: user._id } });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

export { createMeme, getMemes, like, unlike };
