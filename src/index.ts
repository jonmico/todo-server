import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}.`);
});
