// --- src/pages/shopping-view/ShoppingCheckout.jsx ---
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// NOTE: Please ensure 'Address' component and Redux slices are correctly imported
// and available in your project structure.
import { Address } from "../shopping-view/Address"; 
import { deleteCartItem } from "../../store/shop/cart-slice";
import { createOrder, clearOrderState, selectOrderState } from "../../store/order-slice";

const bannerImage = "https://media.istockphoto.com/id/1197819752/photo/shopping-cart-with-a-note-paper-writing-checkout-on-it.jpg?s=1024x1024&w=is&k=20&c=X5KdbK_p8TNuyNDhRFe-Ja1mH-DkQyQtQF2qPUfnwMo=";

// -------------------- CheckoutCartItem Component --------------------
// Memoized component for performance
const CheckoutCartItem = React.memo(({ cartItem, onDelete }) => {
  // Use optional chaining and nullish coalescing for safe access
  const price = Number(cartItem?.salePrice ?? cartItem?.price ?? 0);
  const quantity = Number(cartItem?.quantity ?? 0);
  const itemTotal = price * quantity;
  const title = cartItem?.title ?? "Untitled Product";

  const handleDelete = () => {
    // Robust way to find product ID
    const productId = cartItem.productId || cartItem._id || cartItem.id; 
    if (!productId) {
      console.error("Cannot delete item, missing product ID", cartItem);
      return toast.error("Cannot delete item: missing product ID");
    }
    // Fixed: Confirm dialog uses the product title
    if (window.confirm(`Remove "${title}" from cart?`)) onDelete(productId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      // Use a distinct key for item (cartItem.productId is better if available)
      className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/80 transition-colors"
    >
      <img
        src={cartItem?.image || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'></svg>"}
        alt={title}
        className="w-16 h-16 object-cover rounded-md border border-gray-600 flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-semibold truncate text-gray-100">{title}</h4>
        <p className="text-xs text-gray-400">
          Qty: <span className="font-medium">{quantity}</span>
        </p>
        <p className="text-sm font-bold text-amber-400">
          ${itemTotal.toFixed(2)}
          <span className="text-xs font-normal text-gray-500 ml-1">(${price.toFixed(2)} each)</span>
        </p>
      </div>
      <motion.button
        onClick={handleDelete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-1 text-red-500 hover:text-red-400 rounded-full transition bg-gray-800/80 flex-shrink-0"
        aria-label={`Remove ${title} from cart`}
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
});
CheckoutCartItem.displayName = "CheckoutCartItem";

// -------------------- ShoppingCheckout Component --------------------
const ShoppingCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely select state data
  const { cartItems = [] } = useSelector((state) => state.shoppingCart || {});
  const { user } = useSelector((state) => state.auth || {});
  const orderState = useSelector(selectOrderState) || {};
  const { isLoading = false, error = null, order: createdOrder } = orderState; // Added createdOrder for check

  const userId = user?.id ?? null;
  const customerName = user?.name ?? "Guest User";

  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Calculate Total Amount using useMemo for efficiency
  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.salePrice ?? item?.price ?? 0);
      const quantity = Number(item?.quantity ?? 0);
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  const SHIPPING_COST = 10.0;
  const GRAND_TOTAL = totalAmount + SHIPPING_COST;
  const itemsCount = cartItems.length;
  // Order is disabled if: empty cart, loading, no payment method, or no address
  const isOrderDisabled = itemsCount === 0 || isLoading || !paymentMethod || !selectedAddress;

  // Clear previous order state on mount
  useEffect(() => {
    // Only clear if an order was previously created or if there was an error
    if (createdOrder || error) {
        dispatch(clearOrderState());
    }
  }, [dispatch, createdOrder, error]);

  // Handle Redux error display
  useEffect(() => {
    if (error) {
        toast.error(`Order Error: ${String(error)}`);
    }
  }, [error]);

  // -------------------- Delete Cart Item --------------------
  const handleDeleteFromCart = useCallback(
    (productId) => {
      // Check for user login before dispatching delete action
      if (!userId) {
        // NOTE: In a real app, unauthorized delete might be handled differently, 
        // but this protects the Redux state consistency if it relies on userId.
        return toast.error("Please log in to modify cart.");
      }
      dispatch(deleteCartItem({ userId, productId }));
      toast.success("Item removed from cart!");
    },
    [dispatch, userId]
  );

  // -------------------- Place Order Logic --------------------
  const handlePlaceOrder = useCallback(async () => {
    // Pre-flight checks (redundant but good for UX)
    if (itemsCount === 0) return toast.warn("Cart is empty");
    if (!selectedAddress) return toast.error("Select a delivery address");
    if (!paymentMethod) return toast.error("Select a payment method");

    // Prepare order items in a clean format for the backend
    const items = cartItems.map((item) => ({
      id: item.productId || item._id || item.id, // Ensure a unique ID is sent
      title: item.title,
      quantity: item.quantity,
      price: item.salePrice || item.price,
      image: item.image,
    }));

    const orderData = {
      userId,
      customerName,
      items,
      amount: totalAmount, // Pass subtotal amount
      shipping: SHIPPING_COST,
      totalAmount: GRAND_TOTAL, // Pass grand total
      paymentMethod,
      address: selectedAddress,
    };

    try {
      // Dispatch the async thunk
      const resultAction = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(resultAction)) {
        const payload = resultAction.payload || {};
        const orderObj = payload.order || payload; // The created order object
        const orderId = orderObj.orderId || orderObj._id || "unknown";

        if (paymentMethod === "COD") {
          toast.success(`Order #${orderId} placed successfully (COD)`);
          // Navigate to the OrderDetailsPage with COD flag and order object in state
          navigate(`/shop/account/orders/${orderId}?cod=true`, { 
              state: { order: orderObj } 
          });
        } else {
          // Navigate to the MockPayment gateway with the created order object
          navigate("/shop/payment", { 
              state: { order: orderObj } 
          });
        }
      } else {
        // Handle failure state from Redux thunk
        const err = resultAction.payload || resultAction.error || "Unknown error";
        console.error("Order failed:", err);
        // Display a user-friendly error message
        const errorMessage = typeof err === "string" ? err : err.message || JSON.stringify(err);
        toast.error(`Order failed: ${errorMessage.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error("Unexpected error placing order:", err);
      toast.error("Unexpected error placing order");
    }
  }, [
    cartItems,
    customerName,
    GRAND_TOTAL,
    SHIPPING_COST,
    totalAmount, // Added for completeness in orderData
    itemsCount,
    navigate,
    paymentMethod,
    selectedAddress,
    userId,
    dispatch,
  ]);

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <header className="relative h-[300px] w-full overflow-hidden shadow-2xl shadow-black">
        <img
          src={bannerImage}
          alt="Checkout"
          // Improved image styling for a darker, more cinematic look
          className="h-full w-full object-cover object-center filter brightness-[0.4] contrast-125"
        />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h1 className="text-5xl font-extrabold text-white tracking-widest bg-black bg-opacity-50 p-6 rounded-xl border border-indigo-700">
            SECURE CHECKOUT
          </h1>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Delivery Address & Payment (Left/Top) */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* 1. Delivery Address */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-amber-400 mb-4">1. Delivery Address</h2>
            {/* NOTE: Address component must handle address selection */}
            <Address selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
            {selectedAddress ? (
              <p className="mt-4 text-sm font-medium text-green-400">
                Selected: **{selectedAddress.street ?? selectedAddress.city ?? "Address Selected"}**
              </p>
            ) : (
              <p className="mt-4 text-sm font-medium text-red-400">Please select an address</p>
            )}
          </div>

          {/* 2. Payment Method */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-amber-400 mb-4">2. Payment Method</h2>
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COD Option */}
              <label
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-indigo-500 ring-4 ring-indigo-500/50 bg-indigo-900/30"
                    : "border-gray-600 hover:border-indigo-500"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="hidden"
                />
                <h4 className="text-xl font-bold text-gray-100 mb-1">Cash on Delivery</h4>
                <p className="text-sm text-gray-400">Pay with cash upon delivery</p>
              </label>

              {/* ONLINE Option */}
              <label
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === "ONLINE"
                    ? "border-indigo-500 ring-4 ring-indigo-500/50 bg-indigo-900/30"
                    : "border-gray-600 hover:border-indigo-500"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="hidden"
                />
                <h4 className="text-xl font-bold text-gray-100 mb-1">Pay Online</h4>
                <p className="text-sm text-gray-400">Redirect to secure gateway</p>
              </label>
            </fieldset>

            {/* Error Display */}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-400 p-3 bg-red-900/30 rounded border border-red-700">
                {String(error)}
              </p>
            )}
          </div>
        </section>

        {/* Order Summary (Right/Bottom) */}
        <aside className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 h-fit sticky top-4">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-3 mb-4 text-indigo-400">
            Order Summary ({itemsCount} Items)
          </h2>
          
          {/* Cart Items List */}
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar-thin">
            {itemsCount > 0 ? (
              cartItems.map((item, index) => (
                // Use a stable key (product ID)
                <CheckoutCartItem 
                    key={item.productId || item._id || item.id || index} 
                    cartItem={item} 
                    onDelete={handleDeleteFromCart} 
                />
              ))
            ) : (
              <p className="text-gray-400 italic py-4 text-center">Your cart is empty. Go shopping!</p>
            )}
          </div>

          {/* Financial Totals */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center text-xl font-semibold mb-2">
              <span className="text-gray-300">Subtotal:</span>
              <span className="text-gray-100">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-md text-gray-400 border-b border-gray-700 pb-2 mb-3">
              <span>Shipping:</span>
              <span>${SHIPPING_COST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-extrabold text-indigo-400">
              <span>Total:</span>
              <span>${GRAND_TOTAL.toFixed(2)}</span>
            </div>

            {/* Place Order Button */}
            <motion.button
              onClick={handlePlaceOrder}
              whileHover={{ scale: isOrderDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isOrderDisabled ? 1 : 0.98 }}
              className="w-full mt-6 py-3 text-lg font-bold rounded-lg bg-amber-500 text-gray-900 hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/50"
              disabled={isOrderDisabled}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                </div>
              ) : (
                "Place Order"
              )}
            </motion.button>

            {/* Hint Message */}
            {isOrderDisabled && !isLoading && (
              <p className="mt-2 text-xs text-center text-red-300">
                Ensure cart items, address & payment method are selected.
              </p>
            )}
          </div>
        </aside>
      </main>
      {/* Footer or Padding */}
      <div className="h-10"></div>
    </div>
  );
};

export default ShoppingCheckout;