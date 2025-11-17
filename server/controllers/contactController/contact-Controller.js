const express = require("express");
const Contact = require("../../models/contactModel");
const nodemailer = require("nodemailer");

const router = express.Router();

// -----------------------------
// Nodemailer configuration
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ameerhamzarana0000786@gmail.com",
    pass: "AmeerHamza@1122",
  },
});

// -----------------------------
// Controller + Routes
// -----------------------------

// Create a new contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newContact = await Contact.create({ name, email, message });

    // Send email notification
    await transporter.sendMail({
      from: "ameerhamzarana0000786@gmail.com",
      to: "ameerhamzarana0000786@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(201).json({ success: true, message: "Message sent successfully", data: newContact });
  } catch (err) {
    console.error("Contact creation failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Export router directly (routes + controller together)
module.exports = router;
