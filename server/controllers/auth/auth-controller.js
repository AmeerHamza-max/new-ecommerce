const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// ----------------------------
// Config
// ----------------------------
const JWT_SECRET = process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const IS_PROD = process.env.NODE_ENV === "production";

// ----------------------------
// Debug Helpers
// ----------------------------
const logInfo = (msg, data) => console.log(`[AuthController] ${msg}:`, data);
const logError = (msg, error) => console.error(`[AuthController] ${msg}:`, error);

// ----------------------------
// Create JWT Token
// ----------------------------
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.userName,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

// --- START: UPDATED REGISTER USER FUNCTION ---

// ----------------------------
// Register User
// ----------------------------
const registerUser = async (req, res) => {
  try {
    // 5 Required Fields + CAPTCHA Check (I am not a robot)
    const { 
        userName, 
        email, 
        password, 
        confirmPassword, 
        role = 'user', // New Field (default to 'user')
        isNotRobot // CAPTCHA field
    } = req.body;

    // 1. Initial Field Check
    if (!userName || !email || !password || !confirmPassword) {
      logError("Missing fields on registration", req.body);
      return res.status(400).json({ success: false, message: "Username, Email, and Passwords are required" });
    }

    // 2. CAPTCHA / "I am not a robot" Check
    if (!isNotRobot) {
        logError("CAPTCHA check failed", email);
        return res.status(400).json({ success: false, message: "Please confirm you are not a robot" });
    }

    // 3. Password Match Check
    if (password !== confirmPassword) {
        logError("Passwords do not match", email);
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // 4. Existing User Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logError("User already exists", email);
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // 5. Hash and Save User
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPassword, role });
    await newUser.save();

    logInfo("User Registered Successfully", { id: newUser._id, username: newUser.userName, email: newUser.email, role: newUser.role });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: { id: newUser._id, username: newUser.userName, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    logError("Register Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- END: UPDATED REGISTER USER FUNCTION ---

// ----------------------------
// Login User
// ----------------------------
const loginUser = async (req, res) => {
// ... (rest of the loginUser function remains unchanged)
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logError("Missing email or password on login", req.body);
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logError("User not found during login", email);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logError("Incorrect password for user", email);
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    logInfo("User Logged In Successfully", { id: user._id, username: user.userName, email: user.email });
    logInfo("Cookies Set", req.cookies);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, username: user.userName, email: user.email, role: user.role },
    });
  } catch (error) {
    logError("Login Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Check Auth
// ----------------------------
const checkAuth = async (req, res) => {
// ... (rest of the checkAuth function remains unchanged)
  try {
    const token = req.cookies?.token;
    if (!token) {
      logError("No token provided in cookies", req.cookies);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    logInfo("Decoded Token", decoded);

    const user = await User.findById(decoded.id).select("userName email role");
    if (!user) {
      logError("User not found in DB", decoded.id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: { id: user._id, username: user.userName, email: user.email, role: user.role },
    });
  } catch (error) {
    logError("CheckAuth Error", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ----------------------------
// Logout User
// ----------------------------
const logoutUser = (req, res) => {
// ... (rest of the logoutUser function remains unchanged)
  res.clearCookie("token", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
    path: "/",
  }).status(200).json({ success: true, message: "Logged out successfully" });

  logInfo("User Logged Out", req.cookies);
};

// ----------------------------
// Auth Middleware
// ----------------------------
const authMiddleware = (req, res, next) => {
// ... (rest of the authMiddleware function remains unchanged)
  try {
    const token = req.cookies?.token;
    if (!token) {
      logError("Unauthorized access attempt, no token", req.cookies);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    logInfo("AuthMiddleware: Token Verified", decoded);
    next();
  } catch (error) {
    logError("AuthMiddleware Error", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  authMiddleware,
};