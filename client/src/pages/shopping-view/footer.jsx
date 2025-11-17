import React from "react";
import { useNavigate } from "react-router-dom";
import { Linkedin, Instagram, Facebook, Twitter, ChevronRight } from "lucide-react";
import { shoppingViewHeaderMenuItems } from "@/config";
import { motion } from "framer-motion";

function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const iconHover = {
    whileHover: { scale: 1.2, color: "#fbbf24" }, // amber-400
    transition: { type: "spring", stiffness: 300 },
  };

  const buttonHover = {
    whileHover: { scale: 1.05, backgroundColor: "#f59e0b" }, // amber-500
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <motion.footer
      className="bg-black text-gray-300 pt-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand + Socials */}
        <motion.div variants={fadeUp} className="space-y-4">
          <motion.h2 className="text-2xl font-bold text-white" variants={fadeUp}>
            SH
          </motion.h2>
          <motion.p className="text-gray-400 text-sm" variants={fadeUp}>
            Premium fashion and lifestyle products curated for your style and comfort.
          </motion.p>
          <motion.div className="flex space-x-4 mt-2">
            <motion.a
              href="https://www.linkedin.com/in/ameer-hamza-web-developer/"
              target="_blank"
              rel="noopener noreferrer"
              {...iconHover}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.div {...iconHover}>
              <Instagram size={20} />
            </motion.div>
            <motion.div {...iconHover}>
              <Facebook size={20} />
            </motion.div>
            <motion.div {...iconHover}>
              <Twitter size={20} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} className="space-y-4">
          <motion.h3 className="text-xl font-semibold text-white" variants={fadeUp}>
            Quick Links
          </motion.h3>
          <motion.ul className="space-y-2 text-gray-400 text-sm" variants={containerVariants}>
            {shoppingViewHeaderMenuItems
              .filter((item) => ["home", "products"].includes(item.id))
              .map((item) => (
                <motion.li key={item.id} variants={fadeUp}>
                  <motion.button
                    className="hover:text-amber-400 transition flex items-center gap-1 text-left w-full"
                    onClick={() => handleNavigation(item.path)}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ChevronRight size={14} /> {item.label}
                  </motion.button>
                </motion.li>
              ))}

            <motion.li variants={fadeUp}>
              <motion.button
                className="hover:text-amber-400 transition flex items-center gap-1 text-left w-full"
                onClick={() => handleNavigation("/about")}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronRight size={14} /> About Us
              </motion.button>
            </motion.li>

            <motion.li variants={fadeUp}>
              <motion.button
                className="hover:text-amber-400 transition flex items-center gap-1 text-left w-full"
                onClick={() => handleNavigation("/contact")}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronRight size={14} /> Contact
              </motion.button>
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={fadeUp} className="space-y-4">
          <motion.h3 className="text-xl font-semibold text-white" variants={fadeUp}>
            Newsletter
          </motion.h3>
          <motion.p className="text-gray-400 text-sm" variants={fadeUp}>
            Stay updated with new arrivals and exclusive deals.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-2" variants={containerVariants}>
            <motion.input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
              variants={fadeUp}
            />
            <motion.button
              className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg"
              variants={fadeUp}
              {...buttonHover}
            >
              Subscribe
            </motion.button>
          </motion.div>
        </motion.div>

      </div>

      <motion.div
        className="mt-12 border-t border-gray-800 py-6 text-center text-gray-500 text-sm"
        variants={fadeUp}
      >
        <motion.p variants={fadeUp}>© 2025 SH All rights reserved.</motion.p>
        <motion.p variants={fadeUp}>
          Designed & Developed by{" "}
          <motion.a
            href="https://www.linkedin.com/in/ameer-hamza-web-developer/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Ameer Hamza
          </motion.a>
        </motion.p>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;
