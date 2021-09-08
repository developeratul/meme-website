"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// middlewares
const errorHandler_1 = require("./middlewares/errorHandler");
// routers
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const memeRouter_1 = __importDefault(require("./routes/memeRouter"));
const profileRouter_1 = __importDefault(require("./routes/profileRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// app configs
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use((0, cookie_parser_1.default)());
// Database connection
const connectionString = process.env.DB_URL || "";
mongoose_1.default
    .connect(connectionString)
    .then(() => console.log("- Connected to mongoDB database "))
    .catch((err) => console.log("-", err.message || err));
// application routes
app.use("/auth", authRouter_1.default);
app.use("/meme", memeRouter_1.default);
app.use("/profile", profileRouter_1.default);
// for production
if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https")
            res.redirect(`https://${req.header("host")}${req.url}`);
        else
            next();
    });
}
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
    });
}
// error handlings
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// starting the server
try {
    app.listen(port, () => console.log(`- Listening to port [${port}]`));
}
catch (err) {
    console.log(err.message || err);
}
