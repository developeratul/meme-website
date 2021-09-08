"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// controllers
var authController_1 = require("../controllers/authController");
var auth_1 = __importDefault(require("../middlewares/auth"));
var router = express_1.default.Router();
// for registering a user
router.post("/signup", authController_1.singnup);
// for signing in
router.post("/signin", authController_1.signin);
// for verifying if the user is authenticated
router.get("/", auth_1.default, authController_1.checkAuth);
// for logging out a user
router.get("/logout", auth_1.default, authController_1.logout);
exports.default = router;
