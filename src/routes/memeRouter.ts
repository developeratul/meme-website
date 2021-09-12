import express from "express";

import auth from "../middlewares/auth";
import multer from "../utils/multer";

// controllers
import {
  createMeme,
  getMemes,
  like,
  unlike,
  deleteMeme,
  editMeme,
  getMemeById,
} from "../controllers/memeController";

const router = express.Router();

// for creating a new meme
router.post("/", auth, multer.single("image"), createMeme);

// for getting memes from DB
router.get("/", getMemes);

router.get("/getMemeById/:id", getMemeById);

// for liking a meme
router.post("/like", auth, like);

// for unLiking a meme
router.post("/unlike", auth, unlike);

// for deleting a meme
router.delete("/delete_meme", auth, deleteMeme);

// for editing a meme
router.post("/edit_meme", auth, multer.single("image"), editMeme);

export default router;
