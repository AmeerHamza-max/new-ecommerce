import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    fetchCart,
    updateCartItem,
    // decreaseCartItem, // Ise updateCartItem se handle kiya jaa sakta hai, ya alag se rakha jaa sakta hai.
    deleteCartItem,
} from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast"; // assuming this is a custom hook
import { Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserCartWrapper = ({ userId }) => {
    const dispatch = useDispatch();
    const { cartItems = [], isLoading, error } = useSelector(
        (state) => state.shoppingCart
    );
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Initial Cart Fetching
    useEffect(() => {
        if (userId) {
            dispatch(fetchCart(userId))
                .unwrap()
                .catch(() => {
                    toast({ title: "Failed to load cart", variant: "destructive" });
                });
        }
    }, [userId, dispatch]);

    // 2. Total Calculation
    const totalAmount = cartItems.reduce(
        (total, item) => total + (item.salePrice || item.price || 0) * (item.quantity || 0),
        0
    );

    // 3. Handlers
    const handleRemove = (productId) => {
        if (!userId) return toast({ title: "User not loaded yet", variant: "destructive" });

        // Removed URL logic is kept for completeness, but not essential for the visual bug
        // updateURLWithRemovedItem(productId); 

        dispatch(deleteCartItem({ userId, productId }))
            .unwrap()
            .then(() => toast({ title: "Item removed from cart" }))
            .catch(() => toast({ title: "Failed to remove item", variant: "destructive" }));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        const newQuantity = Number(quantity);
        if (!userId || newQuantity < 1) return;

        dispatch(updateCartItem({ userId, productId, quantity: newQuantity }))
            .unwrap()
            .then(() => {
                // Agar quantity 0 ho jaaye toh delete kar dena behtar hai
                if (newQuantity === 0) handleRemove(productId);
                else toast({ title: "Quantity updated" });
            })
            .catch(() => toast({ title: "Failed to update quantity", variant: "destructive" }));
    };

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity <= 1) {
            handleRemove(productId);
            return;
        }
        // Update function use karna behtar hai, decreaseCartItem ki bajaye
        handleUpdateQuantity(productId, currentQuantity - 1);
    };
    
    // Yahan handleCheckout ko wapas le aaye hain jaisa ShoppingHeader mein tha
    // Kyunki is wrapper ko sirf content area mein use kiya gaya hai.
    // ShoppingHeader mein bhi is button ka code hai, isliye is function ki zaroorat nahi.
    /* const handleCheckout = () => {
        toast({ title: "Checkout clicked", variant: "default" });
    }; */

    // 4. Animation Variants
    const itemVariants = {
        initial: { opacity: 0, x: 50, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, x: -50, scale: 0.8, transition: { duration: 0.3 } },
    };

    // -----------------------------
    // JSX
    // -----------------------------
    return (
        // Root div ki padding aur height ab ShoppingHeader se aa rahi hai
        <div className="flex flex-col h-full"> 
            {/* Header ko ShoppingHeader se nikal kar CartWrapper mein dal diya hai */}
            {/* Kyunki yeh drawer ke content ka hissa hai. */}
            {/* NOTE: Agar aap chahte hain ki yeh content area (overflow-y-auto) ka hissa na ho, 
            toh ise is component se nikal kar ShoppingHeader.jsx mein fixed position wale div ke andar rakhen. */}
            {/* Filhal, main ise yahan se hata raha hoon taaki ShoppingHeader ke code se conflict na ho */}
            {/* <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Cart</h3> */}

            {isLoading && (
                <div className="p-4 text-center text-gray-400">Loading cart...</div>
            )}
            {error && <p className="p-4 text-red-500">{error}</p>}

            {/* Cart Items List */}
            <div className="flex-1 space-y-4"> {/* Removed overflow-y-auto here to rely on parent */}
                <AnimatePresence mode="popLayout"> 
                    {cartItems.length === 0 && !isLoading ? (
                        <motion.p
                            key="empty"
                            className="text-gray-500 p-4"
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
                                <img // motion.img removed for simplicity, as only div animation is enough
                                    src={item.image || "/placeholder.png"}
                                    alt={item.title || "Product Image"}
                                    className="w-20 h-20 object-cover rounded transition duration-300"
                                />

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <p className="text-gray-100 font-medium line-clamp-2">
                                        {item.title || "Unnamed Product"}
                                    </p>
                                    {/* ... other info ... */}

                                    <div className="flex items-center gap-2 mt-2">
                                        {/* DECREASE BUTTON */}
                                        <button 
                                            onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                                            className="bg-gray-700 text-gray-100 p-1 rounded transition duration-200 hover:scale-110 active:scale-95"
                                            type="button" 
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity || 1}
                                            onChange={(e) =>
                                                handleUpdateQuantity(item.productId, Number(e.target.value))
                                            }
                                            className="w-12 text-black p-1 rounded text-center" // w-12 is better for a small number
                                        />
                                        {/* INCREASE BUTTON */}
                                        <button 
                                            onClick={() =>
                                                handleUpdateQuantity(item.productId, (item.quantity || 1) + 1)
                                            }
                                            className="bg-gray-700 text-gray-100 p-1 rounded transition duration-200 hover:scale-110 active:scale-95"
                                            type="button"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex flex-col items-end justify-between h-full">
                                    <span className="text-gray-100 font-semibold whitespace-nowrap">
                                        ${((item.salePrice || item.price) * (item.quantity || 1)).toFixed(2)}
                                    </span>
                                    {/* REMOVE BUTTON */}
                                    <button 
                                        onClick={() => handleRemove(item.productId)}
                                        className="text-red-500 p-1 rounded transition duration-200 hover:scale-125 active:scale-95"
                                        type="button"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Total Section ko ShoppingHeader mein use kiye gaye button ke upar rakhenge */}
            {/* Is section ko yahan se hata kar ShoppingHeader mein Total & Checkout ke liye alag se div banao */}
            {/* Kyunki yeh content area (overflow-y-auto) se bahar hona chahiye. */}

            {/* Corrected logic ke liye, maine total aur checkout ko hamesha visible rakhne ke liye ShoppingHeader mein adjust kiya hai. */}
            {/* Agar aapko Total aur Checkout is component mein chahiye aur overflow ko theek karna hai, toh ye dono sections hamesha CartWrapper ke bahar hone chahiye. */}
            
            {/* Is component se total aur checkout button remove kar diye gaye hain. */}
            {/* Kyunki yeh content area (h-[calc(100%-116px)]) mein overflow na ho isliye, yeh sections ShoppingHeader.jsx mein Cart Sheet ke andar alag div mein hone chahiye. */}
            
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="text-gray-100">
                    <span className="font-semibold">Subtotal: </span>
                    <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                {/* Checkout Button ko yahan se hata kar ShoppingHeader mein le jaayenge */}
            </div>

        </div>
    );
};

export default UserCartWrapper;