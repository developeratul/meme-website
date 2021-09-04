import express from "express";

// controllers
import { singnup, signin } from "../controllers/authController";

const router = express.Router();

// for registering a user
router.post("/signup", singnup);

// for signing in
router.post("/signin", signin);

export default router;
