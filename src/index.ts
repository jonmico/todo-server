import express from "express";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(errorHandler);

app.listen(3000, () => {
  console.log("App is listening on port 3000.");
});
