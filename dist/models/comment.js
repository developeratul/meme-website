"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dataSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    meme: { type: mongoose_1.default.Types.ObjectId, ref: "Meme", required: true },
    time: { type: Number, required: true },
});
const Comment = mongoose_1.default.model("Comment", dataSchema);
exports.default = Comment;
