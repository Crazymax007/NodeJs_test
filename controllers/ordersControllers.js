const Order = require("../schemas/v1/order.schema");
const Product = require("../schemas/v1/products.Schema");
const User = require("../schemas/v1/user.schema");

const createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    let totalPrice = 0;

    // คำนวณราคาสินค้าและเตรียมข้อมูลสินค้า
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error("Product not found");
      totalPrice += product.price * item.quantity;
    }

    // สร้างคำสั่งซื้อ
    const order = new Order({
      userId,
      products,
      totalPrice,
    });

    await order.save();

    // ใช้ populate เพื่อดึงข้อมูล User และ Product
    const savedOrder = await Order.findById(order._id)
      .populate("userId", "name") // ดึงเฉพาะชื่อผู้สั่ง
      .populate("products.productId", "name"); // ดึงชื่อสินค้า

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body; // รับข้อมูลสินค้าที่อัพเดท
  try {
    // ค้นหาคำสั่งซื้อ
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ตัวแปรสำหรับคำนวณราคาทั้งหมด
    let totalPrice = 0;
    let updatedProducts = [];
    console.log("PO:", products);
    // ลูปเพื่ออัพเดทสินค้าภายในคำสั่งซื้อ
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }

      // คำนวณราคาใหม่สำหรับสินค้าที่อัพเดท
      const updatedProduct = {
        productId: item.productId,
        quantity: item.quantity,
      };
      updatedProducts.push(updatedProduct);
      totalPrice += product.price * item.quantity; // คำนวณราคาสินค้าใหม่
    }

    // อัพเดทคำสั่งซื้อ
    order.products = updatedProducts;
    order.totalPrice = totalPrice;

    // บันทึกคำสั่งซื้อที่อัพเดท
    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder: order,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ userId }).populate("products.productId");

    // ส่งคำสั่งซื้อหากพบ
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    // ค้นหาคำสั่งซื้อ
    const order = await Order.findById(id).populate("products.productId");

    // เช็คว่าเจอคำสั่งซื้อนั้นหรือไม่
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // เช็คว่าคำสั่งซื้อนั้นมีสินค้าอยู่หรือไม่
    if (order.products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this order" });
    }

    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProductFromOrder = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    // ค้นหาคำสั่งซื้อ
    const order = await Order.findById(orderId);

    // เช็คว่าเจอคำสั่งซื้อนั้นหรือไม่
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // หาสินค้าในคำสั่งซื้อมาที่ต้องการลบ
    const productIndex = order.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    // ถ้าไม่พบสินค้าในคำสั่งซื้อนั้น
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in this order" });
    }

    // ดึงข้อมูลสินค้าที่จะลบ
    const productToRemove = order.products[productIndex];

    // ลบสินค้าออกจาก array
    order.products.splice(productIndex, 1);

    // คำนวณ totalPrice ใหม่หลังจากลบสินค้า
    let totalPrice = 0;
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }

    // อัพเดทคำสั่งซื้อ
    order.totalPrice = totalPrice;

    // บันทึกคำสั่งซื้อที่อัพเดท
    await order.save();

    // ส่งข้อมูลที่ถูกลบไปใน response
    res.status(200).json({
      message: "Product removed from order successfully",
      removedProduct: productToRemove, // ข้อมูลสินค้าที่ถูกลบ
      updatedOrder: order, // คำสั่งซื้อที่อัพเดท
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    // ค้นหาคำสั่งซื้อ
    const order = await Order.findById(id);

    // เช็คว่าเจอคำสั่งซื้อนั้นหรือไม่
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // เช็คว่าคำสั่งซื้อนั้นมีสินค้าอยู่หรือไม่
    if (order.products.length === 0) {
      return res
        .status(400)
        .json({ message: "No products found in this order to delete" });
    }

    // ลบคำสั่งซื้อ
    const deletedOrder = await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  deleteOrder,
  deleteProductFromOrder,
};
