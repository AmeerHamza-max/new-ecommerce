// --- src/hooks/useCartTotals.js ---

import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// NOTE: Aapko apni application ke hisab se Tax Rate aur Shipping Rate ko adjust karna hoga.
const DEFAULT_TAX_RATE = 0.05; // 5% Tax
const DEFAULT_SHIPPING_RATE = 10.00; // $10.00 fixed shipping

/**
 * Custom hook to calculate the cart summary totals (Subtotal, Tax, Shipping, Discount, Total).
 * @returns {Object} An object containing all calculated cart totals and the item array.
 */
export const useCartTotals = () => {
    // Redux store se cart state nikalna
    const { cartItems = [] } = useSelector((state) => state.shoppingCart);
    
    // Yahan calculations karne ke liye useMemo ka istemal kiya gaya hai
    // taki yeh calculations sirf cartItems badalne par hi dobara hon.
    const totals = useMemo(() => {
        
        // 1. Subtotal Calculation
        const subtotal = cartItems.reduce((sum, item) => {
            const price = item.salePrice || item.price || 0;
            const quantity = item.quantity || 0;
            return sum + (price * quantity);
        }, 0);

        // 2. Discount Calculation (Example: 10% off agar subtotal $100 se zyada ho)
        let discount = 0;
        if (subtotal >= 100) {
            discount = subtotal * 0.10; // 10% discount
        }
        
        // 3. Tax, Shipping aur Discount ke baad ka Subtotal
        const subtotalAfterDiscount = subtotal - discount;

        // 4. Shipping Calculation (Example: Free shipping agar subtotal $200 se zyada ho)
        const shipping = subtotalAfterDiscount >= 200 ? 0.00 : DEFAULT_SHIPPING_RATE;

        // 5. Tax Calculation (Tax is applied on Subtotal after discount + Shipping)
        const taxableBase = subtotalAfterDiscount + shipping;
        const tax = taxableBase * DEFAULT_TAX_RATE;
        
        // 6. Grand Total
        const total = taxableBase + tax;
        
        // Return values ko fixed 2 decimal places tak round off karna behtar hai
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            cartItems: cartItems // Cart items bhi wapas bhej rahe hain
        };
    }, [cartItems]); // Dependency array: Cart items change hone par re-calculate ho
    
    return totals;
};