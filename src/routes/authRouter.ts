import express from "express";

// controllers
import { singnup } from "../controllers/authController";

const router = express.Router();

// for registering a user
router.post("/signup", singnup);

export default router;
