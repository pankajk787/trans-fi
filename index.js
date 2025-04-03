const express = require("express");
const path = require("node:path");
const { PORT, WHITELIST } = require("./constants/envs");
const connectDB = require("./config/db");
const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");
const cron = require("node-cron");
const deleteData = require("./cron-job");
// const cors = require("cors"); // Same Origin now - not required
// const { corsOptions } = require("./cors-options");

const app = express();

connectDB();

const whitelist = [process.env.FRONTEND_URL];

// app.use(cors(corsOptions)); // Same Origin now
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Cron job
cron.schedule("0 */2 * * *", () => { // Every 2 hours
  console.log("Running cron job to delete expired files...", new Date().toLocaleString());
  console.log("********* Cron job started ***********");
  deleteData();
});

// Routes
app.use("/api/files", filesRouter);
app.use("/files", showRouter);
app.use("/files/download", downloadRouter);

app.get("/", (req, res) => {
  return res.render("index");
});
app.get("/health", (req, res) => {
  return res.json({ status: "UP", healthy: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});