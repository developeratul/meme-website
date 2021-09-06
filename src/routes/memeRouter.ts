import express from "express";

import auth from "../middlewares/auth";

// controllers
import { createMeme } from "../controllers/memeController";
import multer from "../utils/multer";

const router = express.Router();

// for creating a new meme
router.post("/", auth, multer.single("image"), createMeme);

export default router;
