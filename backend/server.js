const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// DB connection
require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Waste2Decor Backend Running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Socket connection
io.on("connection", (socket) => {

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendMessage", ({ room, message }) => {
    io.to(room).emit("receiveMessage", message);
  });

});

// Start server
const PORT = 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});