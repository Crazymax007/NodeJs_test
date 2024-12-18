const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // อ้างอิงถึง Schema User (ถ้ามี)
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // อ้างอิงถึง Schema Product
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // คำนวณตอนบันทึก
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // สร้าง createdAt และ updatedAt ให้โดยอัตโนมัติ
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
