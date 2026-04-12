const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const Product = require("../models/Product");


// ================= ADD PRODUCT =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.filename : ""
    });

    await product.save();

    res.json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add product"
    });
  }
});

// ================= GET ALL PRODUCTS =================
router.get("/all", async (req, res) => {
  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});


// ================= GET PRODUCTS BY CATEGORY =================
router.get("/category/:type", async (req, res) => {
  try {

    const category = req.params.type;

    const products = await Product.find({ category });

    res.json(products);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch category products"
    });
  }
});


// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
});

module.exports = router;