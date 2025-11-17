const express = require("express");
const multer = require("multer");

const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const router = express.Router();

// ---------------------------------
// Multer Memory Storage Setup
// ---------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----------------------------
// Debug Helper
// ----------------------------
const logRoute = (route, info) => console.log(`[AdminProductRouter] ${route} called`, info || "");

// ---------------------------------
// Product Routes
// ---------------------------------

// Upload product image
router.post("/upload-image", upload.single("my_file"), async (req, res) => {
  logRoute("POST /upload-image", { file: req.file?.originalname });
  try {
    await handleImageUpload(req, res);
  } catch (error) {
    console.error("[AdminProductRouter] Upload Image Error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// Add new product
router.post("/add", async (req, res) => {
  logRoute("POST /add", { body: req.body });
  try {
    await addProduct(req, res);
  } catch (error) {
    console.error("[AdminProductRouter] Add Product Error:", error);
    res.status(500).json({ success: false, message: "Adding product failed" });
  }
});

// Fetch all products
router.get("/get", async (req, res) => {
  logRoute("GET /get");
  try {
    await fetchAllProducts(req, res);
  } catch (error) {
    console.error("[AdminProductRouter] Fetch Products Error:", error);
    res.status(500).json({ success: false, message: "Fetching products failed" });
  }
});

// Edit product
router.put("/edit/:id", async (req, res) => {
  logRoute("PUT /edit/:id", { id: req.params.id, body: req.body });
  try {
    await editProduct(req, res);
  } catch (error) {
    console.error("[AdminProductRouter] Edit Product Error:", error);
    res.status(500).json({ success: false, message: "Editing product failed" });
  }
});

// Delete product
router.delete("/delete/:id", async (req, res) => {
  logRoute("DELETE /delete/:id", { id: req.params.id });
  try {
    await deleteProduct(req, res);
  } catch (error) {
    console.error("[AdminProductRouter] Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Deleting product failed" });
  }
});

module.exports = router;
