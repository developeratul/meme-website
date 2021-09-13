"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// utils
const multer_1 = __importDefault(require("../utils/multer"));
// middlewares
const auth_1 = __importDefault(require("../middlewares/auth"));
// controllers
const settingsController_1 = require("../controllers/settingsController");
const router = express_1.default.Router();
// for updating the account information's of a user
router.post("/update_account_settings", auth_1.default, settingsController_1.update_account_settings);
// for updating the profile avatar of the user
router.post("/update_profile_avatar", auth_1.default, multer_1.default.single("image"), settingsController_1.update_profile_avatar);
// for updating the security information's
router.post("/update_security_settings", auth_1.default, settingsController_1.update_security_settings);
exports.default = router;
