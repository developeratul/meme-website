import mongoose from "mongoose";
import { CommentInterface } from "./comment";

import { UserInterface } from "./user";

export interface MemeInterface extends mongoose.Document {
  title: string;
  photoUrl: string;
  photoId: string;
  author: UserInterface;
  likes: string[];
  comments: CommentInterface[];
  time: number;
}

const dataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photoUrl: { type: String, required: true },
  photoId: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  time: { type: String, required: true },
});

const Meme: mongoose.Model<MemeInterface> = mongoose.model("Meme", dataSchema);

export default Meme;
