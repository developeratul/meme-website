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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    portfolio: { type: String, required: true },
    time: { type: Number, required: true, default: Date.now() },
    photoUrl: { type: String },
    photoId: { type: String },
    memes: [{ type: mongoose_1.default.Types.ObjectId, ref: "Meme" }],
    tokens: [{ token: String }],
});
// hashing the password before save
dataSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
            next();
        }
    });
});
// generating a web token
dataSchema.methods.generateWebToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = jsonwebtoken_1.default.sign({ id: this._id.toString() }, `${process.env.JWT_SECRET}`);
            this.tokens = this.tokens.concat({ token });
            yield this.save();
            return token;
        }
        catch (err) {
            console.log(err.message || err);
        }
    });
};
const User = mongoose_1.default.model("User", dataSchema);
exports.default = User;
