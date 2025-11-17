import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/shop/product-slice";
import Footer from "./Footer";
import { shoppingViewHeaderMenuItems } from "@/config";
import { ShoppingBag, Watch } from "lucide-react";

// ------------------
// Slider Images
// ------------------
const slides = [
  "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=2000",
];

// ------------------
// Category Icon Mapping
// ------------------
const categoryIcons = {
  men: ShoppingBag,
  women: ShoppingBag,
  kids: ShoppingBag,
  footwear: ShoppingBag,
  accessories: Watch,
};

const categoryMap = {
  men: "mens_clothing",
  women: "womens_clothing",
  kids: "kids_clothing",
  footwear: "footwear",
  accessories: "accessories",
};

// ------------------
// Animation Variants
// ------------------
const sliderVariants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 1.2 } },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const productVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.05, boxShadow: "0px 15px 30px rgba(255,255,255,0.15)" },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

// ------------------
// Main Component
// ------------------
function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { productList, loading } = useSelector((state) => state.shopProducts);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider Auto Change
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  // Fetch Products
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const params = new URLSearchParams(location.search);
  const urlCategory = params.get("category") || "";

  const handleCategoryClick = (catId) => {
    const mappedCategory = categoryMap[catId] || catId;
    const newParams = new URLSearchParams(location.search);
    newParams.set("category", mappedCategory);
    navigate(`/shop/listing?${newParams.toString()}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = shoppingViewHeaderMenuItems.filter(
    (item) => !["home", "products"].includes(item.id)
  );

  // ------------------------------
  // FILTER + LIMIT TO FIRST 4 PRODUCTS
  // ------------------------------
  const filteredProducts = productList
    .filter((p) => (urlCategory ? p.category === urlCategory : true))
    .slice(0, 4); // Only show first 4

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-y-scroll scrollbar-hide">
      {/* HERO SLIDER */}
      <div className="relative w-full h-[500px] sm:h-[700px] overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={slides[currentIndex]}
            alt={`Banner ${currentIndex}`}
            variants={sliderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/95"></div>

        {/* Slider Text Overlay */}
        <motion.div
          className="absolute bottom-16 left-8 sm:left-16 max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 1.2 } }}
        >
          <motion.h1
            className="text-4xl sm:text-6xl font-bold mb-4"
            variants={textVariants}
            custom={0.1}
            initial="hidden"
            animate="visible"
          >
            Welcome to Our Shop
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-300"
            variants={textVariants}
            custom={0.3}
            initial="hidden"
            animate="visible"
          >
            Explore the best products handpicked just for you
          </motion.p>
        </motion.div>
      </div>

      {/* CATEGORIES */}
      <section className="py-16 px-6 sm:px-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          variants={textVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          Shop By Category
        </motion.h2>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || ShoppingBag;
            return (
              <motion.div
                key={cat.id}
                variants={categoryVariants}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className={`w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex flex-col items-center justify-center rounded-xl shadow-lg border cursor-pointer 
                  ${
                    urlCategory === categoryMap[cat.id]
                      ? "bg-blue-600 border-blue-500"
                      : "bg-neutral-800 border-gray-700"
                  }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { duration: 0.5 } }}
                >
                  <Icon className="w-8 h-8 mb-2" />
                </motion.div>

                <motion.span
                  className="text-white font-medium"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
                >
                  {cat.label}
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-16 px-6 sm:px-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          variants={textVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.length > 0 ? "Products" : "No products found"}
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              variants={productVariants}
              whileHover="hover"
              className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-700 p-4 cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              <motion.img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.8, delay: idx * 0.05 },
                }}
              />

              <motion.h3
                className="text-lg font-semibold"
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.1 + idx * 0.05 },
                }}
              >
                {product.title}
              </motion.h3>

              <motion.p
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.2 + idx * 0.05 },
                }}
              >
                {product.brand}
              </motion.p>

              <motion.p
                className="text-xl font-bold mt-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.3 + idx * 0.05 },
                }}
              >
                ${product.price}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default ShoppingHome;
