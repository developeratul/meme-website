"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = __importDefault(require("../utils/multer"));
// controllers
const memeController_1 = require("../controllers/memeController");
const router = express_1.default.Router();
// for creating a new meme
router.post("/", auth_1.default, multer_1.default.single("image"), memeController_1.createMeme);
// for getting memes from DB
router.get("/", memeController_1.getMemes);
router.get("/getMemeById/:id", memeController_1.getMemeById);
// for liking a meme
router.post("/like", auth_1.default, memeController_1.like);
// for unLiking a meme
router.post("/unlike", auth_1.default, memeController_1.unlike);
// for deleting a meme
router.delete("/delete_meme", auth_1.default, memeController_1.deleteMeme);
// for editing a meme
router.post("/edit_meme", auth_1.default, multer_1.default.single("image"), memeController_1.editMeme);
exports.default = router;
