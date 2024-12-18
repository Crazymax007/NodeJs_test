const express = require("express");
const router = express.Router();

const {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  deleteOrder,
  deleteProductFromOrder
} = require("../../controllers/ordersControllers");

// Create Order
router.post("/Create", createOrder);

// Update Order
router.patch("/Update/:id", updateOrder);

// Get All Orders
router.get("/Read", getAllOrders);

// Get Orders by User
router.get("/Read/user/:userId", getOrdersByUser);

// Get Order by ID
router.get("/Read/:id", getOrderById);

// Delete Product from Order
router.delete("/Delete/:orderId/products/:productId", deleteProductFromOrder);

// Delete Order
router.delete("/Delete/:id", deleteOrder);

module.exports = router;
