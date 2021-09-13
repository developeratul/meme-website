import { NextFunction, Response } from "express";
import User from "../models/user";
import cloudinary from "../utils/cloudinary";

async function update_account_settings(req: any, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    // updating the user
    await User.updateOne({ _id: req.user._id }, { name, email, password });

    // getting the info of updated user
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: "memes",
      options: { sort: { time: -1 } },
      populate: { path: "author" },
    });

    // sending the response
    res.status(200).json({ message: "Your account was updated", user });
  } catch (err) {
    next(err);
  }
}

async function update_profile_avatar(req: any, res: Response, next: NextFunction) {
  try {
    const { photoId } = req.body;
    const image = req.file.path;

    // remove the previous image
    if (photoId) {
      await cloudinary.uploader.destroy(photoId);
    }

    // uploading the new image
    const newImage = await cloudinary.uploader.upload(image, {
      folder: `meme-site/Profile-Pictures`,
    });

    // updating in the database
    await User.updateOne(
      { _id: req.user._id },
      { photoUrl: newImage.secure_url, photoId: newImage.public_id }
    );

    // getting the info of the updated user
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: "memes",
      options: { sort: { time: -1 } },
      populate: { path: "author" },
    });

    res.status(200).json({ message: "Your avatar has been updated", user });
  } catch (err) {
    next(err);
  }
}

async function update_security_settings(req: any, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;

    req.user.password = password;
    await req.user.save();

    const user = await User.findOne({ _id: req.user._id });

    res.status(200).json({ message: "Your password has been updated", user });
  } catch (err) {
    next(err);
  }
}

export { update_account_settings, update_profile_avatar, update_security_settings };
