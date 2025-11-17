const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../controllers/auth/auth-controller");

const router = express.Router();

// -----------------------------
// Debug helper
// -----------------------------
const logRoute = (route, info) => console.log(`[AuthRouter] ${route} called`, info || "");

// -----------------------------
// REGISTER
// -----------------------------
router.post("/register", async (req, res) => {
  logRoute("POST /register", { body: req.body });
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("[AuthRouter] Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// -----------------------------
// LOGIN
// -----------------------------
router.post("/login", async (req, res) => {
  logRoute("POST /login", { body: req.body });
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("[AuthRouter] Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// -----------------------------
// LOGOUT
// -----------------------------
router.post("/logout", async (req, res) => {
  logRoute("POST /logout");
  try {
    await logoutUser(req, res);
  } catch (error) {
    console.error("[AuthRouter] Logout Error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});

// -----------------------------
// CHECK AUTH (Protected Route)
// -----------------------------
router.get("/check-auth", authMiddleware, async (req, res) => {
  logRoute("GET /check-auth", { user: req.user });
  try {
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: req.user,
    });
  } catch (error) {
    console.error("[AuthRouter] CheckAuth Error:", error);
    res.status(500).json({ success: false, message: "Failed to check authentication" });
  }
});

module.exports = router;
