const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createCloudinaryStorage } = require("../config/cloudinary");
const BulkWaste = require("../models/BulkWaste");

// Setup multer for Cloudinary image upload
const storage = createCloudinaryStorage("bulk");
const upload = multer({ storage });

// Create a bulk waste listing
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { material, weight, price, sellerId, condition, userId } = req.body;
    
    const newBulkWaste = new BulkWaste({
      material,
      weight: Number(weight),
      price: Number(price),
      condition,
      image: req.file ? req.file.path : null, // Cloudinary URL
      sellerId: userId || sellerId
    });

    await newBulkWaste.save();
    res.status(201).json({ message: "Bulk waste listed successfully", bulkWaste: newBulkWaste });
  } catch (error) {
    console.error("Error adding bulk waste:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all available bulk waste
router.get("/all", async (req, res) => {
  try {
    const bulkWastes = await BulkWaste.find({ status: "Available" })
                                      .populate("sellerId", "name email")
                                      .sort({ createdAt: -1 });
    res.json(bulkWastes);
  } catch (error) {
    console.error("Error fetching bulk waste:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE BULK WASTE =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await BulkWaste.findByIdAndDelete(req.params.id);
    res.json({ message: "Bulk waste listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
