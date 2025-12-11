// --- src/components/shopping-view/CartSummary.jsx ---

import React from 'react';
import { ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';

/**
 * Renders a detailed summary of the shopping cart totals.
 * @param {Object} props
 * @param {number} props.subtotal - The sum of all item prices.
 * @param {number} props.shipping - Shipping cost.
 * @param {number} props.tax - Calculated tax amount.
 * @param {number} props.discount - Applied discount amount (negative value is handled inside).
 * @param {number} props.total - The final grand total.
 * @param {boolean} props.isProcessing - State for loading/processing indicator.
 * @param {boolean} props.hideCheckoutButton - If true, hides the main checkout/continue button.
 * @param {function} props.onCheckoutClick - Handler for the checkout/continue button (only used if button is visible).
 * @param {string} props.className - Additional classes for styling the container.
 */
export const CartSummary = ({
    subtotal = 0,
    shipping = 0,
    tax = 0,
    discount = 0,
    total = 0,
    isProcessing = false,
    hideCheckoutButton = false,
    onCheckoutClick = () => {},
    className = '',
}) => {

    // Helper function for rendering price rows
    const renderPriceRow = (label, amount, isDiscount = false) => (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className={isDiscount ? 'text-red-400 font-semibold' : 'text-white'}>
                {isDiscount ? `-$${Math.abs(amount).toFixed(2)}` : (amount === 0 && label === "Shipping" ? 'FREE' : `$${amount.toFixed(2)}`)}
            </span>
        </div>
    );

    return (
        <div className={`bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl transition duration-300 ${className}`}>
            <h3 className="text-xl font-extrabold text-white mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-amber-400" />
                Order Summary
            </h3>

            {/* Price Details Section */}
            <div className="space-y-3 pb-4 border-b border-gray-800">
                {renderPriceRow("Subtotal (Items)", subtotal)}
                {renderPriceRow("Shipping", shipping)}
                {renderPriceRow("Discount", discount, true)}
                {renderPriceRow("Tax", tax)}
            </div>

            {/* Grand Total */}
            <div className="mt-5 pt-3 flex justify-between items-center text-xl font-bold text-amber-400 border-t border-gray-800">
                <span>Total Payable</span>
                <span className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {total.toFixed(2)}
                </span>
            </div>

            {/* Checkout Button (Conditional) */}
            {!hideCheckoutButton && (
                <button
                    onClick={onCheckoutClick}
                    disabled={isProcessing || total <= 0}
                    className="w-full mt-6 py-3 text-lg font-bold rounded-lg bg-green-600 text-black hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                >
                    {isProcessing ? (
                        <>
                            <ShoppingCart className="animate-spin w-5 h-5 mr-2" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};