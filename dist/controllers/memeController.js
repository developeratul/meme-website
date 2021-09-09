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
exports.deleteMeme = exports.unlike = exports.like = exports.getMemes = exports.createMeme = void 0;
const meme_1 = __importDefault(require("../models/meme"));
const user_1 = __importDefault(require("../models/user"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
function createMeme(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title } = req.body;
            const user = req.user;
            const image = req.file.path;
            const photoUrl = yield cloudinary_1.default.uploader.upload(image, {
                folder: `meme-site/${user.name}`,
            });
            const newMeme = new meme_1.default({
                title,
                photoUrl: photoUrl.secure_url,
                photoId: photoUrl.public_id,
                author: user._id,
                time: Date.now(),
            });
            yield user_1.default.updateOne({ _id: user._id }, { $push: { memes: newMeme } });
            const meme = yield (yield newMeme.save()).populate("author");
            res.status(200).json({ message: "Meme posted", meme });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.createMeme = createMeme;
function getMemes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { search } = req.query;
            if (search) {
                const memes = (yield meme_1.default.find({ title: { $regex: `${search}`, $options: "gi" } })
                    .populate("author")
                    .sort({ time: -1 })) || [];
                res.status(200).json({ memes });
            }
            else {
                yield meme_1.default.find({})
                    .populate("author")
                    .sort({ time: -1 })
                    .exec((err, memes) => {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.status(200).json({ memes });
                    }
                });
            }
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getMemes = getMemes;
function like(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { memeId } = req.body;
            const user = req.user;
            yield meme_1.default.updateOne({ _id: memeId }, { $push: { likes: user._id } });
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.like = like;
function unlike(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { memeId } = req.body;
            const user = req.user;
            yield meme_1.default.updateOne({ _id: memeId }, { $pull: { likes: user._id } });
            res.sendStatus(200);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.unlike = unlike;
function deleteMeme(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { memeId, memeImageId } = req.body;
            yield meme_1.default.findOneAndRemove({ _id: memeId }); // deleting the meme
            yield cloudinary_1.default.uploader.destroy(memeImageId); // deleting the meme image
            // updating the users meme's field
            yield user_1.default.updateOne({ _id: req.user._id }, { $pull: { memes: memeId } });
            res.status(200).json({ message: "The meme was deleted" });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.deleteMeme = deleteMeme;
