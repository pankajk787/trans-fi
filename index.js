const express = require("express");
const path = require("node:path");
const { PORT } = require("./constants/envs");
const connectDB = require("./config/db");
const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");

const app = express();

app.use(express.json());

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use("/api/files", filesRouter);
app.use("/files", showRouter);
app.use("/files/download", downloadRouter);

app.get("/health", (req, res) => {
  return res.json({ status: "UP", healthy: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});