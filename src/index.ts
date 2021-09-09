import "dotenv/config";
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// middlewares
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

// routers
import authRouter from "./routes/authRouter";
import memeRouter from "./routes/memeRouter";
import profileRouter from "./routes/profileRouter";

const app: Application = express();
const port: string | number = process.env.PORT || 8000;

// app configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Database connection
const connectionString: string = process.env.DB_URL || "";
mongoose
  .connect(connectionString)
  .then(() => console.log("- Connected to mongoDB database "))
  .catch((err) => console.log("-", err.message || err));

// application routes
app.use("/auth", authRouter);
app.use("/meme", memeRouter);
app.use("/profile", profileRouter);

// for production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
};

// error handlings
app.use(notFoundHandler);
app.use(errorHandler);

// starting the server
try {
  app.listen(port, () => console.log(`- Listening to port [${port}]`));
} catch (err: any) {
  console.log(err.message || err);
}
