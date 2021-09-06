import mongoose from "mongoose";

import { User } from "./user";

interface Meme extends mongoose.Document {
  title: string;
  photoUrl: string;
  photoId: string;
  author: User;
  time: number;
}

const dataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photoUrl: { type: String, required: true },
  photoId: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true },
  time: { type: String, default: Date.now() },
});

const Meme: mongoose.Model<Meme> = mongoose.model("Meme", dataSchema);

export default Meme;
