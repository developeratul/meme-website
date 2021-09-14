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
import commentRouter from "./routes/commentRouter";
import settingsRouter from "./routes/settingsRouter";

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
app.use("/get_profile", profileRouter);
app.use("/comment", commentRouter);
app.use("/get_settings", settingsRouter);

// for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'))
  
  app.get('*', function (req, res) {
    const fullPath = path.join(__dirname,  '../client', 'build', 'index.html')
    res.sendFile(fullPath)
  })
}

// error handlings
app.use(notFoundHandler);
app.use(errorHandler);

// starting the server
try {
  app.listen(port, () => console.log(`- Listening to port [${port}]`));
} catch (err: any) {
  console.log(err.message || err);
}
