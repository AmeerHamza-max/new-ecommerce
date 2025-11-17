const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// ----------------------------
// Debug helper
// ----------------------------
const logInfo = (msg, data) => console.log(`[AdminProductController] ${msg}:`, data);
const logError = (msg, error) => console.error(`[AdminProductController] ${msg}:`, error);

// ----------------------------
// Upload Product Image (Cloudinary)
// ----------------------------
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      logError("No file received", req.file);
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const uploadResult = await imageUploadUtils(base64Image);

    if (!uploadResult || !uploadResult.url) {
      logError("Cloudinary Upload Failed", uploadResult);
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    logInfo("Image Upload Successful", uploadResult.url);
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: uploadResult.url, public_id: uploadResult.public_id },
    });
  } catch (error) {
    logError("Image Upload Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during image upload",
      error: error.message,
    });
  }
};

// ----------------------------
// Add New Product
// ----------------------------
const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    logInfo("Product Added", newProduct._id);
    return res.status(201).json({ success: true, message: "Product added successfully", result: newProduct });
  } catch (error) {
    logError("Add Product Error", error);
    return res.status(500).json({ success: false, message: error.message || "Adding product failed" });
  }
};

// ----------------------------
// Fetch All Products
// ----------------------------
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    logInfo("Fetched All Products", products.length);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    logError("Fetch Products Error", error);
    return res.status(500).json({ success: false, message: "Fetching products failed" });
  }
};

// ----------------------------
// Edit Product
// ----------------------------
const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      logError("Product Not Found", req.params.id);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    logInfo("Product Updated", updatedProduct._id);
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    logError("Edit Product Error", error);
    return res.status(500).json({ success: false, message: "Updating product failed" });
  }
};

// ----------------------------
// Delete Product
// ----------------------------
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      logError("Product Not Found for Deletion", req.params.id);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    logInfo("Product Deleted", deletedProduct._id);
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    logError("Delete Product Error", error);
    return res.status(500).json({ success: false, message: "Deleting product failed" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
