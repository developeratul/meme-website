import "dotenv/config";
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

// middlewares
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

// routers
import authRouter from "./routes/authRouter";

const app: Application = express();
const port: string | number = process.env.PORT || 8000;

// app configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ["http://localhost:3000"] }));

// Database connection
const connectionString: string = process.env.DB_URL || "";
mongoose
  .connect(connectionString)
  .then(() => console.log("- Connected to mongoDB database "))
  .catch((err) => console.log("-", err.message || err));

// application routes
app.use("/auth", authRouter);

// error handlings
app.use(notFoundHandler);
app.use(errorHandler);

// starting the server
try {
  app.listen(port, () => console.log(`- Listening to port [${port}]`));
} catch (err: any) {
  console.log(err.message || err);
}
