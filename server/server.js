const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// -----------------------------
// Import Routes
// -----------------------------
const adminProductRouter = require("./routes/admin/products-routes");
const authRouter = require("./routes/auth-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const contactRouter=require('./controllers/contactController/contact-Controller')

// -----------------------------
// App Setup
// -----------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// MongoDB Connection
// -----------------------------
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://ameerhamza:ameerhamza@ac-jp3ihl2-shard-00-00.q800t9k.mongodb.net:27017,ac-jp3ihl2-shard-00-01.q800t9k.mongodb.net:27017,ac-jp3ihl2-shard-00-02.q800t9k.mongodb.net:27017/?ssl=true&replicaSet=atlas-jxxex0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });

// -----------------------------
// Middleware Setup
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -----------------------------
// CORS Setup
// -----------------------------
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

// -----------------------------
// Routes Setup
// -----------------------------
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/contact", contactRouter); // <- Modular contact routes

// -----------------------------
// Default route
// -----------------------------
app.get("/", (req, res) => {
  console.log("[Server] Default route called - API is running smoothly");
  res.status(200).json({ success: true, message: "API is running smoothly" });
});

// -----------------------------
// Error Handling Middleware
// -----------------------------
app.use((err, req, res, next) => {
  console.error("[Server] Unexpected Error:", err.stack || err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
