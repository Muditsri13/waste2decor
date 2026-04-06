const express = require("express");
const router = express.Router();

const Order = require("../models/Order");


// ➤ CREATE ORDER
router.post("/create", async (req, res) => {
  try {

    const order = new Order(req.body);

    await order.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to place order"
    });
  }
});


// ➤ GET USER ORDERS
router.get("/:userId", async (req, res) => {
  try {

    const orders = await Order.find({ userId: req.params.userId })
      .populate("productId");

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});

module.exports = router;