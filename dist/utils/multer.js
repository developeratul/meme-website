"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
// I am doing all the validations in the front-end so I am not filtering the files here
exports.default = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
});
