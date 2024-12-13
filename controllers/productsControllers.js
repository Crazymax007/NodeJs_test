  const Product = require('../schemas/v1/products.Schema')

  const addProduct = async (req, res) => {
    try {
      const { name, price, description, inStock } = req.body;
      const product = new Product({
        name,
        price: Number(price), // แปลงเป็น Number
        description,
        inStock,
      });
      await product.save();
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true, // ส่งค่าที่อัปเดตกลับมา
        runValidators: true, // ตรวจสอบข้อมูลตาม Schema
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const readAll = async (req, res) => {
    try {
      const products = await Product.find(); 
      res.status(200).json({ message: "Products retrieved successfully", products });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const readOne = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id); // ดึงสินค้าด้วย ID
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product retrieved successfully", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await Product.findByIdAndDelete(id); // ลบสินค้าด้วย ID
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  module.exports = {
    addProduct,
    updateProduct,
    readAll,
    readOne,
    deleteProduct,
  };
