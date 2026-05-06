const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Security Packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// DB connection
require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const postRoutes = require("./routes/posts");
const bulkRoutes = require("./routes/bulk");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Security Hardening ---

// 1. Set Security HTTP Headers (Helmet)
// We allow cross-origin images so Cloudinary URLs render correctly
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 4. Rate Limiting (Prevent DDoS & Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window (set high for development)
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);

// --- End Security ---

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bulk", bulkRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Waste2Decor Backend Running 🚀");
});

app.get("/api/debug", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    readyState: mongoose.connection.readyState,
    mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    mongoUriStarts: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : "none",
    mongoUriEndsWithQuote: process.env.MONGO_URI ? process.env.MONGO_URI.endsWith('"') : false
  });
});


// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const Message = require("./models/Message");

// Chat history endpoint
app.get("/api/messages/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

const User = require("./models/User");

// Get all chat rooms for a specific user
app.get("/api/messages/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all messages where the room contains the userId
    // Note: room is formatted as "buyerId_sellerId"
    const messages = await Message.find({ room: { $regex: userId } }).sort({ createdAt: -1 });
    
    // Group by room to get unique conversations
    const uniqueRooms = {};
    for (const msg of messages) {
      if (!uniqueRooms[msg.room]) {
        // Extract the other person's ID
        const ids = msg.room.split("_");
        const partnerId = ids[0] === userId ? ids[1] : ids[0];
        
        // Fetch partner details
        let partnerName = "Unknown User";
        try {
          const partner = await User.findById(partnerId);
          if (partner) partnerName = partner.name;
        } catch (e) {
          // ignore invalid IDs
        }

        uniqueRooms[msg.room] = {
          room: msg.room,
          partnerId,
          partnerName,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
          lastSender: msg.senderName
        };
      }
    }

    res.json(Object.values(uniqueRooms));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user chats" });
  }
});

// Socket connection
io.on("connection", (socket) => {

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendMessage", async ({ room, message, senderId, senderName }) => {
    try {
      // Save to database
      const newMessage = new Message({
        room,
        senderId,
        senderName,
        text: message
      });
      await newMessage.save();

      // Broadcast to room
      io.to(room).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

});

// Start server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});