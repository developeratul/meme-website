"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
// controllers
const memeController_1 = require("../controllers/memeController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
// for creating a new meme
router.post("/", auth_1.default, multer_1.default.single("image"), memeController_1.createMeme);
// for getting memes in the home page by limit of 9
router.get("/", memeController_1.getMemes);
// for liking a meme
router.post("/like", auth_1.default, memeController_1.like);
// for unLiking a meme
router.post("/unlike", auth_1.default, memeController_1.unlike);
exports.default = router;
