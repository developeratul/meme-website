import express from "express";

// controllers
import { singnup, signin, checkAuth, logout } from "../controllers/authController";

import auth from "../middlewares/auth";

const router = express.Router();

// for registering a user
router.post("/signup", singnup);

// for signing in
router.post("/signin", signin);

// for verifying if the user is authenticated
router.get("/", auth, checkAuth);

// for logging out a user
router.get("/logout", auth, logout);

export default router;
