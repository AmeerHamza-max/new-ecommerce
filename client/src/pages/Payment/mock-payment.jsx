// --- src/pages/Payment/MockPayment.jsx ---
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { CreditCard, Lock, RotateCcw } from "lucide-react";

const MockPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Safe access to order object passed via navigate state
  const orderWrapper = location.state?.order;
  const order = orderWrapper?.order ?? orderWrapper; // Handles nested or flat order structure

  // --- Initial Checks and Redirects ---
  useEffect(() => {
    if (!order) {
      toast.error("No order found. Redirecting to checkout.");
      // Redirect if order data is missing in state
      navigate("/shop/checkout", { replace: true });
    }
  }, [order, navigate]);

  // If order is missing, stop rendering early to allow useEffect redirect to work
  if (!order) {
    return null;
  }

  // 2. Determine the final Order ID and amounts
  const finalOrderId = order.orderId || order._id || "unknown";

  if (finalOrderId === "unknown") {
    console.error("[CRITICAL] Order ID missing:", order);
    toast.error("Critical error: Order ID not available. Redirecting...");
    navigate("/shop/checkout", { replace: true });
    return null;
  }

  const totalAmount = Number(order.amount ?? 0); // Subtotal
  const shipping = Number(order.shipping ?? 0);
  const items = order.items ?? [];
  const grandTotal = useMemo(() => totalAmount + shipping, [totalAmount, shipping]);

  // --- Payment Form States ---
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 3. Autofill test card details
  const autofillCard = () => {
    setCardNumber("4111 1111 1111 1111");
    setCardName(order.customerName || "Test User");
    setExpiry("12/30");
    setCvv("123");
  };

  // 4. Payment Handling Logic
  const handlePayment = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error("Please fill all payment fields");
      return;
    }

    if (isProcessing) return; // Prevent double click

    setIsProcessing(true);

    // Mock API call simulation
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate successful payment
      toast.success(`Payment of $${grandTotal.toFixed(2)} successful for Order #${finalOrderId}!`);
      
      // Navigate to the new OrderDetailsPage with the order object in state
      navigate(`/shop/account/orders/${finalOrderId}`, { 
          state: { order: order } 
      });

    }, 2000); // 2 seconds delay to simulate processing
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-10 px-4">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl font-extrabold text-amber-400 mb-2 flex items-center gap-3"
      >
        <Lock className="w-8 h-8" /> Secure Payment
      </motion.h1>

      <p className="text-gray-500 mb-8 text-sm">Order Reference: **{finalOrderId}** | Payment Method: **Online**</p>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8">
        
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 bg-gray-800 p-6 rounded-2xl shadow-2xl h-fit border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">Order Summary</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar-thin">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-300 text-sm">{item.title} x <span className="font-bold">{item.quantity}</span></span>
                <span className="text-amber-400 font-semibold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-gray-100">
            <div className="flex justify-between text-lg"><span>Subtotal:</span><span>${totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-base text-gray-400"><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between text-3xl font-extrabold text-indigo-400 border-t border-gray-700 pt-3 mt-3">
              <span>Total Payable:</span><span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-indigo-400" /> Enter Card Details
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number (e.g. 4111 1111 1111 1111)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              disabled={isProcessing}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              maxLength={19}
            />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              disabled={isProcessing}
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                disabled={isProcessing}
                className="w-1/2 p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                disabled={isProcessing}
                className="w-1/2 p-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                maxLength={4}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={autofillCard}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" /> Autofill Test Card
              </button>
              <span className="text-gray-400 text-sm italic">For testing purposes only</span>
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={isProcessing}
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              className="w-full py-4 mt-6 rounded-xl bg-amber-500 text-gray-900 font-extrabold text-xl hover:bg-amber-400 transition disabled:opacity-50 shadow-lg shadow-amber-900/50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                </div>
              ) : (
                `Pay $${grandTotal.toFixed(2)} Now`
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MockPayment;