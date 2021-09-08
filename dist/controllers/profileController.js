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
exports.getProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
function getProfile(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (mongoose_1.default.isValidObjectId(id)) {
                const user = (yield ((_a = (yield user_1.default.findOne({ _id: id }))) === null || _a === void 0 ? void 0 : _a.populate({ path: "memes", populate: { path: "author" } }))) || null;
                if (!user) {
                    res.status(404).json({ message: "User was not found" });
                }
                else {
                    res.status(200).json({ user });
                }
            }
            else {
                res.status(404).json({ message: "User was not found" });
            }
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getProfile = getProfile;
