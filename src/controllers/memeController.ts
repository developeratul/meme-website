import { NextFunction, Request, Response } from "express";
import Meme from "../models/meme";
import { UserInterface } from "../models/user";
import UserModel from "../models/user";
import cloudinary from "../utils/cloudinary";
import mongoose from "mongoose";

async function createMeme(req: any, res: Response, next: NextFunction) {
  try {
    const { title } = req.body;
    const user: UserInterface = req.user;
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

    // if there is a search query use this
    if (search) {
      let memes = [];

      if (search !== "") {
        memes = await Meme.find({
          $or: [{ title: { $regex: `${search}`, $options: "gi" } }],
        })
          .lean()
          .populate("author")
          .sort({ time: -1 });
      } else {
        memes = await Meme.find({}).lean();
      }

      res.status(200).json({ memes });
      // otherwise this one
    } else {
      Meme.find({})
        .lean()
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

async function getMemeById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const validId = mongoose.isValidObjectId(id);

    if (!validId) {
      res.status(404).json({ message: "Meme was not found" });
    } else {
      const meme =
        (await Meme.findOne({ _id: id })
          ?.populate("author")
          .populate({ path: "comments", options: { sort: { time: -1 } }, populate: "user" })) ||
        null;

      if (!meme) {
        res.status(404).json({ message: "Meme was not found" });
      } else {
        res.status(200).json({ meme });
      }
    }
  } catch (err) {
    next(err);
  }
}

async function like(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId } = req.body;
    const user: UserInterface = req.user;

    await Meme.updateOne({ _id: memeId }, { $push: { likes: user._id } });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function unlike(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId } = req.body;
    const user: UserInterface = req.user;

    await Meme.updateOne({ _id: memeId }, { $pull: { likes: user._id } });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}
async function deleteMeme(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId, memeImageId } = req.body;

    await Meme.findOneAndRemove({ _id: memeId }); // deleting the meme
    await cloudinary.uploader.destroy(memeImageId); // deleting the meme image

    // updating the users meme's field
    await UserModel.updateOne({ _id: req.user._id }, { $pull: { memes: memeId } });

    res.status(200).json({ message: "The meme was deleted" });
  } catch (err) {
    next(err);
  }
}

async function editMeme(req: any, res: Response, next: NextFunction) {
  try {
    const { memeId, title, photoId } = req.body;

    // * if there is an image, we have to upload it and also remove the previous one
    if (req.file && req.file.path) {
      const image = req.file.path;

      // removing the previous image
      await cloudinary.uploader.destroy(photoId);
      // uploading the new image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: `meme-site/${req.user.name}`,
      });

      // updating the meme with the information's
      await Meme.updateOne(
        { _id: memeId },
        {
          title,
          photoUrl: uploadedImage.secure_url,
          photoId: uploadedImage.public_id,
          time: Date.now(),
        }
      );

      res.status(200).json({ message: "Meme updated successfully" });
      // * if we don't have any image, just update the title
    } else {
      await Meme.updateOne({ _id: memeId }, { title, time: Date.now() });

      res.status(200).json({ message: "Meme updated successfully" });
    }
  } catch (err) {
    next(err);
  }
}

export { createMeme, getMemes, like, unlike, deleteMeme, editMeme, getMemeById };
