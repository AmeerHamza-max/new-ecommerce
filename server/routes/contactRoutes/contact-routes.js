// server/routes/contactRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createContact,
  getContacts,
} = require("../../controllers/contactController/contact-Controller");

// -----------------------------
// Routes
// -----------------------------

// POST /api/contact - Create new contact and send email
router.post("/", createContact);

// GET /api/contact - Get all contacts (admin view)
router.get("/", getContacts);

module.exports = router;
