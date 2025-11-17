// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage } from "@/store/contactSlice/index.js"; // redux slice
import { toast } from "@/hooks/use-toast"; // optional toast hook
import { useNavigate } from "react-router-dom";

function ContactUs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.contact); // slice state

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(sendContactMessage(formData)).unwrap();
      toast({ title: resultAction.message, variant: "success" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast({ title: err.message || "Failed to send message", variant: "destructive" });
    }
  };

  const goToShop = () => {
    navigate("/shop/listing");
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Contact Us</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-amber-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-amber-400"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={goToShop}
          className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-black font-bold rounded-lg hover:scale-105 transform transition-all duration-500 shadow-md"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}

export default ContactUs;
