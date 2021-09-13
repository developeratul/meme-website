import express from "express";

// utils
import multer from "../utils/multer";

// middlewares
import auth from "../middlewares/auth";

// controllers
import {
  update_account_settings,
  update_profile_avatar,
  update_security_settings,
} from "../controllers/settingsController";

const router = express.Router();

// for updating the account information's of a user
router.post("/update_account_settings", auth, update_account_settings);

// for updating the profile avatar of the user
router.post("/update_profile_avatar", auth, multer.single("image"), update_profile_avatar);

// for updating the security information's
router.post("/update_security_settings", auth, update_security_settings);

export default router;
