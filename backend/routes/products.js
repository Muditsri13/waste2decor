const express = require("express");
const router = express.Router();
const multer = require("multer");

const { createCloudinaryStorage } = require("../config/cloudinary");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Setup multer for Cloudinary image upload
const storage = createCloudinaryStorage("products");
const upload = multer({ storage });

// ================= ADD PRODUCT =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log("======== UPLOAD DEBUG ========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Image not received ❌" });
    }

    if (!req.body.userId || req.body.userId === "null" || req.body.userId === "undefined") {
      return res.status(400).json({ message: "User ID missing or invalid ❌. Please login again." });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.path : null,
      sellerId: req.body.userId
    });

    await product.save();

    res.json({ message: "Product added successfully ✅" });

  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Upload failed ❌", error: error.message, stack: error.stack });
  }
});


// ================= GET ALL PRODUCTS (PAGINATED) =================
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate("sellerId", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
});

// ================= GET PRODUCTS BY SELLER =================
router.get("/seller/:userId", async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller products" });
  }
});


// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product"
    });
  }
});


// ================= DELETE PRODUCT =================
router.delete("/delete/:id", async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
});

// ================= ADD REVIEW =================
router.post("/:id/reviews", async (req, res) => {
  try {
    const { userId, name, rating, comment } = req.body;
    
    // Check if the user has a "Delivered" order for this product
    const Order = require("../models/Order");
    const hasBought = await Order.findOne({ 
      userId, 
      productId: req.params.id, 
      status: "Delivered" 
    });

    if (!hasBought) {
      return res.status(403).json({ message: "You can only review products that have been delivered to you." });
    }

    const product = await Product.findById(req.params.id).populate("sellerId", "name");
    if (!product) return res.status(404).json({ message: "Not found" });

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find(r => r.userId.toString() === userId);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    product.reviews.push({ userId, name, rating: Number(rating), comment });
    await product.save();

    res.json({ message: "Review added successfully", product });

  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
});

// ================= DELETE PRODUCT =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;