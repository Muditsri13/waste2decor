const productRoutes = require("./routes/Products.js");
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orders");

app.use("/api/orders", orderRoutes);

// connect database
require("./config/db");

// import routes
const authRoutes = require("./routes/auth");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Waste2Decor Backend Running 🚀");
});

// start server

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});