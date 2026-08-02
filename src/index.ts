import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import cookieParser from "cookie-parser";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT ?? 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(cors());

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`);
});
