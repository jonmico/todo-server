import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.json({ message: "This is the health endpoint." });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000.");
});
