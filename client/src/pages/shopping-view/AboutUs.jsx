import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();

  const goToShop = () => {
    navigate("/shop/listing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 tracking-tight mb-4">
          About SH Shop
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Curating premium fashion and lifestyle products for those who value style and elegance.
        </p>
      </motion.div>

      {/* Mission / Values */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-8 text-gray-700 text-lg leading-relaxed"
      >
        <p className="transform hover:translate-x-1 transition-all duration-500">
          <span className="font-semibold text-gray-900">SH Shop</span> is dedicated to delivering curated collections that blend the latest fashion trends with timeless elegance. Our focus is on quality, style, and customer satisfaction.
        </p>

        <p className="transform hover:translate-x-1 transition-all duration-500">
          Every product is carefully selected, ensuring luxury, durability, and modern aesthetics. From apparel to accessories, we aim to bring sophistication into your everyday life.
        </p>

        <p className="transform hover:translate-x-1 transition-all duration-500">
          Our mission is to inspire confidence and individuality. At SH Shop, fashion is not just what you wear—it’s a statement of who you are.
        </p>

        <p className="italic text-gray-500 text-center transform hover:scale-105 transition duration-500">
          “Style is a way to say who you are without having to speak.” – SH Shop
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-12 text-center"
      >
        <button
          onClick={goToShop}
          className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-black font-bold rounded-lg hover:scale-105 transform transition-all duration-500 shadow-lg text-lg"
        >
          Explore Our Collection
        </button>
      </motion.div>
    </div>
  );
}

export default AboutUs;
