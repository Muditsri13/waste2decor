const mongoose = require("mongoose");
require("dotenv").config();

console.log("ENV CHECK:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));