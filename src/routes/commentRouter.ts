import express from "express";
import auth from "../middlewares/auth";

// controllers
import { postComment, deleteComment } from "../controllers/commentController";

const router = express.Router();

// for posting a comment
router.post("/", auth, postComment);

// for deleting a comment
router.delete("/", auth, deleteComment);

export default router;
