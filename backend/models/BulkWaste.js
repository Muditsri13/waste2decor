const mongoose = require("mongoose");

const bulkWasteSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true,
    enum: ["Wood", "Plastic", "Cardboard", "Cotton", "E-Waste", "Other"]
  },
  weight: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    default: "Available",
    enum: ["Available", "Sold"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BulkWaste", bulkWasteSchema);
