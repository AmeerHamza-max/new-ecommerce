import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  decreaseCartItem,
  deleteCartItem,
} from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserCartWrapper = ({ userId }) => {
  const dispatch = useDispatch();
  const { cartItems = [], isLoading, error } = useSelector(
    (state) => state.shoppingCart
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId))
        .unwrap()
        .catch(() => {
          toast({ title: "Failed to load cart", variant: "destructive" });
        });
    }
  }, [userId, dispatch]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.salePrice || item.price || 0) * (item.quantity || 0),
    0
  );

  const updateURLWithRemovedItem = (productId) => {
    const searchParams = new URLSearchParams(location.search);
    const removed = searchParams.get("removed");
    const removedList = removed ? removed.split(",") : [];
    removedList.push(productId);
    searchParams.set("removed", removedList.join(","));
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleRemove = (productId) => {
    if (!userId) {
      toast({ title: "User not loaded yet", variant: "destructive" });
      return;
    }

    updateURLWithRemovedItem(productId);

    dispatch(deleteCartItem({ userId, productId }))
      .unwrap()
      .then(() => toast({ title: "Item removed from cart" }))
      .catch(() => toast({ title: "Failed to remove item", variant: "destructive" }));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (!userId || quantity < 1) return;

    dispatch(updateCartItem({ userId, productId, quantity }))
      .unwrap()
      .then(() => toast({ title: "Quantity updated" }))
      .catch(() => toast({ title: "Failed to update quantity", variant: "destructive" }));
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (!userId || currentQuantity <= 1) {
      handleRemove(productId);
      return;
    }

    dispatch(decreaseCartItem({ userId, productId }))
      .unwrap()
      .then(() => toast({ title: "Quantity decreased" }))
      .catch(() => toast({ title: "Failed to decrease quantity", variant: "destructive" }));
  };

  const handleCheckout = () => {
    toast({ title: "Checkout clicked", variant: "default" });
  };

  // -----------------------------
  // Animations
  // -----------------------------
  const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const itemVariants = { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } };

  return (
    <motion.div
      className="p-4 flex flex-col h-full"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Cart</h3>

      {isLoading && <p>Loading cart...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex-1 overflow-y-auto space-y-4">
        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.p
              key="empty"
              className="text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Your cart is empty.
            </motion.p>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.productId}
                className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg"
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                {/* Product Image */}
                <motion.img
                  src={item.image || "/placeholder.png"}
                  alt={item.title || "Product Image"}
                  className="w-20 h-20 object-cover rounded"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />

                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-gray-100 font-medium">{item.title || "Unnamed Product"}</p>
                  {item.brand && <p className="text-gray-400 text-sm">{item.brand}</p>}

                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                      className="bg-gray-700 text-gray-100 p-1 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) =>
                        handleUpdateQuantity(item.productId, Number(e.target.value))
                      }
                      className="w-16 text-black p-1 rounded text-center"
                    />
                    <motion.button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, (item.quantity || 1) + 1)
                      }
                      className="bg-gray-700 text-gray-100 p-1 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-gray-100 font-semibold">
                    ${((item.salePrice || item.price) * (item.quantity || 1)).toFixed(2)}
                  </span>
                  {item.salePrice && item.salePrice < item.price && (
                    <span className="text-gray-400 text-sm line-through">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                  <motion.button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-500 p-1 rounded"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Total & Checkout */}
      <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-4">
        <div>
          <span className="text-gray-100 font-semibold">Total: </span>
          <span className="text-gray-100 font-semibold">${totalAmount.toFixed(2)}</span>
        </div>
        <motion.button
          onClick={handleCheckout}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Checkout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserCartWrapper;
