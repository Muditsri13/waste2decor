const express = require("express");
const router = express.Router();
const multer = require("multer");

const { createCloudinaryStorage } = require("../config/cloudinary");
const Post = require("../models/Post");

// Setup multer for Cloudinary image upload
const storage = createCloudinaryStorage("posts");
const upload = multer({ storage });

// ================= ADD POST =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.body.userId || req.body.userId === "null" || req.body.userId === "undefined") {
      return res.status(400).json({ message: "User ID missing or invalid" });
    }

    const post = new Post({
      userId: req.body.userId,
      author: req.body.author,
      text: req.body.text,
      image: req.file ? req.file.path : null // Cloudinary stores URL in req.file.path
    });

    await post.save();
    res.json({ message: "Post added successfully", post });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
});

// ================= GET ALL POSTS =================
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ================= DELETE POST =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= LIKE/UNLIKE POST =================
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already liked
    const index = post.likes.indexOf(req.body.userId);
    if (index === -1) {
      post.likes.push(req.body.userId); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Action failed" });
  }
});

// ================= COMMENT ON POST =================
router.post("/comment/:id", async (req, res) => {
  try {
    const { userId, author, text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, author, text });
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Comment failed" });
  }
});

module.exports = router;
