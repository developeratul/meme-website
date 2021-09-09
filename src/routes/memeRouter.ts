import express from "express";

import auth from "../middlewares/auth";
import multer from "../utils/multer";

// controllers
import { createMeme, getMemes, like, unlike, deleteMeme } from "../controllers/memeController";

const router = express.Router();

// for creating a new meme
router.post("/", auth, multer.single("image"), createMeme);

// for getting memes in the home page by limit of 9
router.get("/", getMemes);

// for liking a meme
router.post("/like", auth, like);

// for unLiking a meme
router.post("/unlike", auth, unlike);

// for deleting a meme
router.delete("/delete_meme", auth, deleteMeme);

export default router;
