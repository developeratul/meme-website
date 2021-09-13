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
exports.update_security_settings = exports.update_profile_avatar = exports.update_account_settings = void 0;
const user_1 = __importDefault(require("../models/user"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
function update_account_settings(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            // updating the user
            yield user_1.default.updateOne({ _id: req.user._id }, { name, email, password });
            // getting the info of updated user
            const user = yield user_1.default.findOne({ _id: req.user._id }).populate({
                path: "memes",
                options: { sort: { time: -1 } },
                populate: { path: "author" },
            });
            // sending the response
            res.status(200).json({ message: "Your account was updated", user });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.update_account_settings = update_account_settings;
function update_profile_avatar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { photoId } = req.body;
            const image = req.file.path;
            // remove the previous image
            if (photoId) {
                yield cloudinary_1.default.uploader.destroy(photoId);
            }
            // uploading the new image
            const newImage = yield cloudinary_1.default.uploader.upload(image, {
                folder: `meme-site/Profile-Pictures`,
            });
            // updating in the database
            yield user_1.default.updateOne({ _id: req.user._id }, { photoUrl: newImage.secure_url, photoId: newImage.public_id });
            // getting the info of the updated user
            const user = yield user_1.default.findOne({ _id: req.user._id }).populate({
                path: "memes",
                options: { sort: { time: -1 } },
                populate: { path: "author" },
            });
            res.status(200).json({ message: "Your avatar has been updated", user });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.update_profile_avatar = update_profile_avatar;
function update_security_settings(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            req.user.password = password;
            yield req.user.save();
            const user = yield user_1.default.findOne({ _id: req.user._id });
            res.status(200).json({ message: "Your password has been updated", user });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.update_security_settings = update_security_settings;
