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
exports.logout = exports.checkAuth = exports.signin = exports.singnup = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var user_1 = __importDefault(require("../models/user"));
function singnup(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, email, password, portfolio, emailExists, newUser, authToken, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password, portfolio = _a.portfolio;
                    return [4 /*yield*/, user_1.default.findOne({ email: email })];
                case 1:
                    emailExists = (_b.sent()) || null;
                    if (emailExists) {
                        res.status(400).json({ message: "email already exists" });
                    }
                    newUser = new user_1.default({ name: name_1, email: email, password: password, portfolio: portfolio });
                    return [4 /*yield*/, newUser.generateWebToken()];
                case 2:
                    authToken = _b.sent();
                    return [4 /*yield*/, newUser.save()];
                case 3:
                    _b.sent();
                    res.cookie("jwt", authToken, { maxAge: 2592000000 });
                    res.status(200).json({ message: "We have created an account for you!", user: newUser });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    next({ status: 500, message: err_1.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.singnup = singnup;
function signin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, user, passwordMatched, authToken, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, user_1.default.findOne({ email: email })];
                case 1:
                    user = (_b.sent()) || null;
                    if (!!user) return [3 /*break*/, 2];
                    res.status(400).json({ message: "Your account doesn't exists" });
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                case 3:
                    passwordMatched = _b.sent();
                    if (!!passwordMatched) return [3 /*break*/, 4];
                    res.status(400).json({ message: "Invalid credentials" });
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, user.generateWebToken()];
                case 5:
                    authToken = _b.sent();
                    res.cookie("jwt", authToken, { maxAge: 2592000000 });
                    res.status(200).json({ message: "Welcome back " + user.name, user: user });
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    next({ message: err_2.message || err_2 });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.signin = signin;
function checkAuth(req, res, next) {
    try {
        var user = req.user;
        res.status(200).json({ user: user });
    }
    catch (err) {
        next({ message: err.message || err });
    }
}
exports.checkAuth = checkAuth;
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    req.user.tokens = req.user.tokens.filter(function (_a) {
                        var token = _a.token;
                        return token !== req.token;
                    });
                    res.clearCookie("jwt");
                    return [4 /*yield*/, req.user.save()];
                case 1:
                    _a.sent();
                    res.status(200).json({ message: "Logged out as " + req.user.name });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    next({ message: err_3.message || err_3 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.logout = logout;
