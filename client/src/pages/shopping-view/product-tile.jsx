import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, fetchCart } from "../../store/shop/cart-slice";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ShoppingProductTile = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isOnSale = !!product?.salePrice;
  const brandLabel = brandOptionsMap[product?.brand] || product?.brand || "Unknown";
  const categoryLabel = categoryOptionsMap[product?.category] || product?.category || "General";

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent tile click from firing
    if (!user?.id) return alert("Please log in to add items to your cart.");

    try {
      await dispatch(addCartItem({ userId: user.id, productId: product._id, quantity: 1 })).unwrap();
      toast({ title: "Product added to your cart!" });
      dispatch(fetchCart(user.id));
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast({ title: "Failed to add product to cart.", variant: "destructive" });
    }
  };

  return (
    <motion.div
      onClick={() => navigate(`/shop/product/${product._id}`)} // Navigate to detail page
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 20px 40px rgba(0,0,0,0.5)" }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* IMAGE */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative w-full aspect-square bg-gray-800 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product?.image}
          alt={product?.title || "Product image"}
          className="w-full h-full object-contain p-3"
          onError={(e) => (e.target.src = "/fallback-image.png")}
        />
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            SALE
          </span>
        )}
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="p-4 flex flex-col flex-1"
      >
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span className="capitalize">{categoryLabel}</span>
          <span className="capitalize font-medium text-gray-300">{brandLabel}</span>
        </div>

        <h3 className="text-base font-semibold text-gray-100 line-clamp-1 mb-2">
          {product?.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {isOnSale ? (
            <>
              <span className="text-amber-400 font-bold text-lg">${product.salePrice}</span>
              <span className="text-gray-500 text-sm line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-gray-100 font-bold text-lg">${product?.price}</span>
          )}
        </div>

        {product?.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
        )}

        {/* ADD TO CART BUTTON */}
        <motion.button
          onClick={handleAddToCart} // add to cart without navigating
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          Add to Cart
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ShoppingProductTile;
