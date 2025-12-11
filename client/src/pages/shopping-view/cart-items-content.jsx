// --- src/components/shopping-view/cart-items-content.jsx (FINAL FIXED VERSION) ---

import React from 'react'; 
import { motion } from 'framer-motion';

// Component ko sirf single cart item display karna chahiye, na ki API call karni chahiye.
// Isko 'cartItem' prop milta hai, jaisa ki ShoppingCheckout component bhej raha hai.
function UserCartItemsContent({ cartItem }) { 
    
    // Safety destructuring
    const { name, quantity, salePrice, price, imageUrl } = cartItem || {};
    const itemPrice = salePrice || price || 0;
    
    // Safety check
    if (!cartItem || !name) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
        >
            <div className="flex items-center gap-3">
                <img 
                    src={imageUrl || 'placeholder-image.jpg'} 
                    alt={name} 
                    className="w-16 h-16 object-cover rounded border border-gray-600 flex-shrink-0" 
                />
                <div className='truncate'>
                    <p className="text-gray-100 font-semibold truncate max-w-[200px]">{name}</p>
                    <p className="text-sm text-indigo-400 mt-1">
                        Qty: <span className='font-bold'>{quantity}</span> 
                        <span className='ml-3 text-amber-300'>@ ${itemPrice.toFixed(2)} each</span>
                    </p>
                </div>
            </div>
            
            {/* Total Price for this item */}
            <p className="text-xl font-extrabold text-amber-400 flex-shrink-0">
                ${(itemPrice * quantity).toFixed(2)}
            </p>
        </motion.div>
    );
}

export default UserCartItemsContent;