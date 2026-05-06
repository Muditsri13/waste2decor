const express = require("express");
const router = express.Router();

const Order = require("../models/Order");


// ➤ CREATE ORDER (CHECKOUT)
router.post("/create", async (req, res) => {
  try {
    const { productId, userId, sellerId, address, paymentMethod } = req.body;

    const order = new Order({
      productId,
      userId,
      sellerId,
      address,
      paymentMethod
    });

    await order.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({
      message: "Failed to place order"
    });
  }
});


// ➤ GET USER (BUYER) ORDERS
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("productId")
      .populate("sellerId", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch buyer orders"
    });
  }
});

// ➤ GET SELLER ORDERS
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.sellerId })
      .populate("productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seller orders"
    });
  }
});

// ➤ UPDATE ORDER STATUS (SELLER)
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status"
    });
  }
});

module.exports = router;