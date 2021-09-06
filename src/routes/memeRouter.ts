import express from "express";

import auth from "../middlewares/auth";

// controllers
import { createMeme } from "../controllers/memeController";

const router = express.Router();

// for creating a new meme
router.post("/", auth, createMeme);

export default router;
