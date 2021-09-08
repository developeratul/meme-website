"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var profileController_1 = require("../controllers/profileController");
var router = express_1.default.Router();
router.get("/id/:id", profileController_1.getProfile);
exports.default = router;
