const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับสินค้า
const productSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: [true, "Product name is required"] 
    },
    price: { 
      type: Number, 
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"]
    },
    description: { 
      type: String, 
      default: 'No description provided' 
    },
    inStock: { 
      type: Boolean, 
      default: true 
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product; 
  
