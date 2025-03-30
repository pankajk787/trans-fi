const express = require("express");
const path = require("node:path");
const { PORT } = require("./constants/envs");
const connectDB = require("./config/db");
const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");
const cron = require("node-cron");
const deleteData = require("./cron-job");

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Cron job
cron.schedule("38 23 * * *", () => {
  console.log("Running cron job to delete expired files...", new Date().toLocaleString());
  deleteData();
});

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