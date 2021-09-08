import express from "express";

import auth from "../middlewares/auth";

// controllers
import { createMeme, getMemes, like, unlike } from "../controllers/memeController";
import multer from "../utils/multer";

const router = express.Router();

// for creating a new meme
router.post("/", auth, multer.single("image"), createMeme);

// for getting memes in the home page by limit of 9
router.get("/", getMemes);

// for liking a meme
router.post("/like", auth, like);

// for unLiking a meme
router.post("/unlike", auth, unlike);

export default router;
