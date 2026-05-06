const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await user.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 IMPORTANT: SEND FULL USER
    res.json({
      message: "Login successful",
      user: user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL USERS (ADMIN) =================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ================= DELETE USER (ADMIN) =================
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= WISHLIST =================

// Toggle Wishlist
router.post("/wishlist/toggle", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if product is already in wishlist
    const index = user.wishlist.indexOf(productId);
    
    if (index > -1) {
      // Remove it
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } else {
      // Add it
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Added to wishlist", wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist" });
  }
});

// Get User's Wishlist
router.get("/wishlist/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

module.exports = router;