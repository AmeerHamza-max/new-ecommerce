// --- src/pages/shopping-view/ShoppingAccount.jsx ---
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import ShoppingOrders from "./orders";
import { Address } from "./Address";
import OrderDetailsView from "./orders";

const accountImage =
  "https://media.istockphoto.com/id/1412135421/photo/online-ordering-business-image-of-shopping-cart-mockup-with-cardboard-boxes-and-wooden-boxes.jpg?s=1024x1024&w=is&k=20&c=bvkIYG-lOTUg-QT5sMVcpW1PxGorZ_eGKqBREIlI80s=";

const ShoppingAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: orderId } = useParams();

  const pathTab = location.pathname.split("/")[3];
  const [activeTab, setActiveTab] = useState(
    pathTab === "orders" || pathTab === "address" ? pathTab : "orders"
  );

  const tabs = [
    { value: "orders", label: "Orders" },
    { value: "address", label: "Address" }
  ];

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    navigate(`/shop/account/${tabValue}`);
  };

  useEffect(() => {
    if (
      pathTab !== activeTab &&
      (pathTab === "orders" || pathTab === "address")
    ) {
      setActiveTab(pathTab);
    }
  }, [pathTab, activeTab]);

  const tabContentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const isOrderDetailsRoute =
    location.pathname.startsWith("/shop/account/orders/") && orderId;

  return (
    <div className="flex flex-col">
      <div className="relative h-[350px] w-full overflow-hidden">
        <motion.img
          src={accountImage}
          alt="Account Banner"
          className="h-full w-full object-cover object-center"
          animate={{ scale: [1, 1.05, 1], y: [0, 5, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        />
      </div>

      <motion.div
        className="container mx-auto grid grid-cols-1 gap-8 py-8 px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-col rounded-lg border bg-white p-6 shadow-xl dark:bg-gray-800 dark:border-gray-700">
          {/* Tabs */}
          <motion.div
            className="flex border-b mb-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`relative px-4 py-3 -mb-px font-bold text-sm md:text-base border-b-2 transition-all duration-300 ${
                  activeTab === tab.value
                    ? "border-amber-500 text-amber-500 dark:text-amber-400"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                }`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.span
                    className="absolute h-0.5 bg-amber-500 bottom-0 left-0 right-0"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (orderId || "")}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              {activeTab === "orders" && (
                <>
                  {isOrderDetailsRoute ? (
                    <OrderDetailsView />
                  ) : (
                    <ShoppingOrders />
                  )}
                </>
              )}

              {activeTab === "address" && <Address />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ShoppingAccount;
