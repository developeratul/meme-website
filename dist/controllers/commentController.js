"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.postComment = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const meme_1 = __importDefault(require("../models/meme"));
function postComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { text, memeId } = req.body;
            const newComment = new comment_1.default({
                text,
                meme: memeId,
                user: req.user._id,
                time: Date.now(),
            });
            yield meme_1.default.updateOne({ _id: memeId }, { $push: { comments: newComment } });
            yield (yield newComment.save()).populate("user");
            res.status(200).json({ comment: newComment });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.postComment = postComment;
function deleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId, memeId } = req.body;
            yield comment_1.default.findOneAndRemove({ _id: commentId });
            yield meme_1.default.updateOne({ _id: memeId }, { $pull: { comments: commentId } });
            res.sendStatus(200);
        }
        catch (err) { }
    });
}
exports.deleteComment = deleteComment;
