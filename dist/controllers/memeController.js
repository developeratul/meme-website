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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlike = exports.like = exports.getMemes = exports.createMeme = void 0;
var meme_1 = __importDefault(require("../models/meme"));
var user_1 = __importDefault(require("../models/user"));
var cloudinary_1 = __importDefault(require("../utils/cloudinary"));
function createMeme(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var title, user, image, photoUrl, newMeme, meme, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    title = req.body.title;
                    user = req.user;
                    image = req.file.path;
                    return [4 /*yield*/, cloudinary_1.default.uploader.upload(image, {
                            folder: "meme-site/" + user.name,
                        })];
                case 1:
                    photoUrl = _a.sent();
                    newMeme = new meme_1.default({
                        title: title,
                        photoUrl: photoUrl.secure_url,
                        photoId: photoUrl.public_id,
                        author: user._id,
                        time: Date.now(),
                    });
                    return [4 /*yield*/, user_1.default.updateOne({ _id: user._id }, { $push: { memes: newMeme } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, newMeme.save()];
                case 3: return [4 /*yield*/, (_a.sent()).populate("author")];
                case 4:
                    meme = _a.sent();
                    res.status(200).json({ message: "Meme posted", meme: meme });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createMeme = createMeme;
function getMemes(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var search, memes, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    search = req.query.search;
                    if (!search) return [3 /*break*/, 2];
                    return [4 /*yield*/, meme_1.default.find({ title: { $regex: "" + search, $options: "gi" } })
                            .populate("author")
                            .sort({ time: -1 })];
                case 1:
                    memes = (_a.sent()) || [];
                    res.status(200).json({ memes: memes });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, meme_1.default.find({})
                        .populate("author")
                        .sort({ time: -1 })
                        .exec(function (err, memes) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({ memes: memes });
                        }
                    })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getMemes = getMemes;
function like(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var memeId, user, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    memeId = req.body.memeId;
                    user = req.user;
                    return [4 /*yield*/, meme_1.default.updateOne({ _id: memeId }, { $push: { likes: user._id } })];
                case 1:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    next(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.like = like;
function unlike(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var memeId, user, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    memeId = req.body.memeId;
                    user = req.user;
                    return [4 /*yield*/, meme_1.default.updateOne({ _id: memeId }, { $pull: { likes: user._id } })];
                case 1:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.unlike = unlike;
