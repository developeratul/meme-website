"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
// controllers
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
// for posting a comment
router.post("/", auth_1.default, commentController_1.postComment);
// for deleting a comment
router.delete("/", auth_1.default, commentController_1.deleteComment);
exports.default = router;
