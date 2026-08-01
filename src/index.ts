import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ quiet: true });

const app = express();

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}.`);
});
