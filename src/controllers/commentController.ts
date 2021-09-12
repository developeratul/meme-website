import { Response, NextFunction, Request } from "express";
import Comment from "../models/comment";
import Meme from "../models/meme";

async function postComment(req: any, res: Response, next: NextFunction) {
  try {
    const { text, memeId } = req.body;

    const newComment = new Comment({
      text,
      meme: memeId,
      user: req.user._id,
      time: Date.now(),
    });

    await Meme.updateOne({ _id: memeId }, { $push: { comments: newComment } });

    await (await newComment.save()).populate("user");

    res.status(200).json({ comment: newComment });
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { commentId, memeId } = req.body;

    await Comment.findOneAndRemove({ _id: commentId });
    await Meme.updateOne({ _id: memeId }, { $pull: { comments: commentId } });

    res.sendStatus(200);
  } catch (err) {}
}

export { postComment, deleteComment };
