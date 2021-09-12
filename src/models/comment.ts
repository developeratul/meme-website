import mongoose from "mongoose";
import { MemeInterface } from "./meme";
import { UserInterface } from "./user";

export interface CommentInterface extends mongoose.Document {
  text: string;
  user: UserInterface;
  meme: MemeInterface;
  time: number;
}

const dataSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  meme: { type: mongoose.Types.ObjectId, ref: "Meme", required: true },
  time: { type: Number, required: true },
});

const Comment: mongoose.Model<CommentInterface> = mongoose.model("Comment", dataSchema);

export default Comment;
