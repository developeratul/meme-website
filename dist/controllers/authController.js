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
exports.logout = exports.checkAuth = exports.signin = exports.singnup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
function singnup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, portfolio } = req.body;
            const emailExists = (yield user_1.default.findOne({ email })) || null;
            if (emailExists) {
                res.status(400).json({ message: "email already exists" });
            }
            const newUser = new user_1.default({ name, email, password, portfolio });
            const authToken = yield newUser.generateWebToken(); // generating web token
            yield newUser.save();
            res.cookie("jwt", authToken, { maxAge: 2592000000 });
            res.status(200).json({ message: "We have created an account for you!", user: newUser });
        }
        catch (err) {
            next({ status: 500, message: err.message });
        }
    });
}
exports.singnup = singnup;
function signin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = (yield user_1.default.findOne({ email })) || null;
            if (!user) {
                res.status(400).json({ message: "Your account doesn't exists" });
            }
            else {
                const passwordMatched = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatched) {
                    res.status(400).json({ message: "Invalid credentials" });
                }
                else {
                    const authToken = yield user.generateWebToken();
                    res.cookie("jwt", authToken, { maxAge: 2592000000 });
                    res.status(200).json({ message: `Welcome back ${user.name}`, user });
                }
            }
        }
        catch (err) {
            next({ message: err.message || err });
        }
    });
}
exports.signin = signin;
function checkAuth(req, res, next) {
    try {
        const { user } = req;
        res.status(200).json({ user });
    }
    catch (err) {
        next({ message: err.message || err });
    }
}
exports.checkAuth = checkAuth;
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.user.tokens = req.user.tokens.filter(({ token }) => token !== req.token);
            res.clearCookie("jwt");
            yield req.user.save();
            res.status(200).json({ message: `Logged out as ${req.user.name}` });
        }
        catch (err) {
            next({ message: err.message || err });
        }
    });
}
exports.logout = logout;
