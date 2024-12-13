const express = require("express");
const router = express.Router();

// Import controllers
const {
  addProduct,
  updateProduct,
  readAll,
  readOne,
  deleteProduct,
} = require("../../controllers/productsControllers");

//? Create
router.post("/Create", addProduct);

//? Update
router.patch("/Update/:id", updateProduct);

//? ReadAll
router.get("/Read", readAll);

//? ReadOne
router.get("/Read/:id", readOne); // รับ ID ผ่าน parameter

//? Delete
router.delete("/Delete/:id", deleteProduct); // รับ ID ผ่าน parameter

module.exports = router;
