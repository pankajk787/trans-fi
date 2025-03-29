const mongoose = require("mongoose");
const { MONGODB_URI } = require("../constants/envs");

function connectDB() {
    // Connect to MongoDB
  mongoose.connect(MONGODB_URI);
  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
}

module.exports = connectDB;