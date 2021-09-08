"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dataSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    photoUrl: { type: String, required: true },
    photoId: { type: String, required: true },
    author: { type: mongoose_1.default.Types.ObjectId, required: true, ref: "User" },
    likes: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    time: { type: String, required: true },
});
var Meme = mongoose_1.default.model("Meme", dataSchema);
exports.default = Meme;
