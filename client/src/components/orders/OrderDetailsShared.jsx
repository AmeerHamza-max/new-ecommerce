import React from 'react';
import { Truck, MapPin, Package, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

// NOTE: Assume 'order' object has fields:
// _id, status, items, address, totalAmount, amount (subtotal), shipping, customerName, paymentMethod

const OrderDetailsShared = React.memo(({ order }) => {
    // Helper function to get status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shipped': return 'bg-blue-600 text-white';
            case 'Delivered': return 'bg-green-600 text-white';
            case 'Processing': return 'bg-indigo-600 text-white animate-pulse';
            case 'Cancelled': return 'bg-red-600 text-white';
            default: return 'bg-gray-500 text-gray-100';
        }
    };

    if (!order) {
        return <p className="text-center text-gray-400 p-8">Order details not available.</p>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700"
        >
            <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-amber-400">Order #{order._id || 'N/A'}</h2>
                <div className={`px-4 py-2 rounded-full font-bold uppercase text-sm shadow ${getStatusStyle(order.status)}`}>
                    {order.status}
                </div>
            </div>

            {/* General Info and Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Shipping Address */}
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">Shipping Details</h3>
                        <p className="text-gray-300">{order.customerName}</p>
                        <p className="text-sm text-gray-400">{order.address?.street}, {order.address?.city}, {order.address?.zipCode}</p>
                        <p className="text-sm text-gray-400">Payment: **{order.paymentMethod}**</p>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-400" /> Payment Summary</h3>
                    <div className="flex justify-between text-gray-300"><span>Subtotal:</span><span>${Number(order.amount).toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-400 text-sm"><span>Shipping:</span><span>${Number(order.shipping).toFixed(2)}</span></div>
                    <div className="flex justify-between text-2xl font-extrabold text-indigo-400 border-t border-gray-600 pt-2">
                        <span>Grand Total:</span><span>${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <h3 className="text-2xl font-bold text-gray-100 mb-3 flex items-center"><Package className="w-6 h-6 mr-2 text-amber-400" /> Items in Order</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {order.items?.map((item, index) => (
                    <motion.div 
                        key={item.id || index} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-700/80 transition"
                    >
                        <img 
                            src={item.image || 'placeholder.svg'} 
                            alt={item.title} 
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0" 
                        />
                        <div className="flex-grow">
                            <p className="font-semibold text-sm text-gray-100 truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">Unit Price: ${Number(item.price).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-md text-amber-400">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </motion.div>
    );
});

OrderDetailsShared.displayName = "OrderDetailsShared";
export default OrderDetailsShared;