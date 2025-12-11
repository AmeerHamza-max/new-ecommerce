// --- src/pages/account/OrderDetailsView.jsx ---
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Package, Home, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderDetailsView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = useParams();

    const orderWrapper = location.state?.order;
    const order = orderWrapper?.order ?? orderWrapper;

    useEffect(() => {
        if (!order || (orderId && order.orderId !== orderId && order._id !== orderId)) {
            toast.error("Order details are missing or invalid. Redirecting to your orders list.");
            navigate('/shop/account/orders', { replace: true });
        }
    }, [order, orderId, navigate]);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
                Loading Order Details...
            </div>
        );
    }

    // ✅ FIXED FINANCIAL LOGIC
    const SUB_TOTAL = Number(
        order.subTotal ||
        order.cartTotal ||
        order.amount ||
        order.itemsTotal ||
        0
    );

    const SHIPPING_COST = Number(
        order.deliveryFee ||
        order.shippingCost ||
        order.shipping ||
        0
    );

    const GRAND_TOTAL = Number(
        order.totalPrice ||
        order.totalAmount ||
        order.finalAmount ||
        (SUB_TOTAL + SHIPPING_COST)
    );

    const finalOrderId = order.orderId || order._id || "N/A";
    const paymentStatus = order.paymentStatus || (order.paymentMethod === 'COD' ? 'Pending' : 'Paid');
    const paymentMethodDisplay = order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment";
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const address = order.address || {};
    const items = order.items || [];
    const transactionId = order.transactionId || 'N/A';

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid':
            case 'Delivered':
                return 'bg-green-700 text-green-100';
            case 'Pending':
                return 'bg-amber-800 text-amber-100';
            case 'Processing':
                return 'bg-indigo-700 text-indigo-100';
            case 'Failed':
            case 'Cancelled':
                return 'bg-red-700 text-red-100';
            default:
                return 'bg-gray-700 text-gray-100';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-100 max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-start mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-indigo-400">
                    Order Confirmation & Details
                </h1>
                <motion.div 
                    className={`p-3 rounded-lg font-bold text-lg shadow-lg ${getStatusStyle(paymentStatus)}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Status: {paymentStatus}
                    </div>
                </motion.div>
            </div>
            
            <p className="text-gray-500 mb-6 text-sm">
                Thank you for your order, {order.customerName}! Here are your complete order details.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-1 space-y-6">
                    
                    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">Order Summary</h2>
                        <div className="space-y-3 text-gray-300">
                            <p className="flex justify-between">
                                <span className="font-medium flex items-center gap-2"><Package className='w-4 h-4 text-indigo-400'/> Order ID:</span>
                                <span className="font-extrabold text-gray-100">{finalOrderId}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium flex items-center gap-2"><Calendar className='w-4 h-4 text-indigo-400'/> Date Placed:</span>
                                <span>{orderDate}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium flex items-center gap-2"><CreditCard className='w-4 h-4 text-indigo-400'/> Payment Method:</span>
                                <span className="font-bold text-green-400">
                                    {paymentMethodDisplay}
                                </span>
                            </p>
                            <p className="flex justify-between text-sm break-all">
                                <span className="font-medium flex items-center gap-2"><Truck className='w-4 h-4 text-indigo-400'/> Transaction ID:</span>
                                <span className="text-gray-400">{transactionId}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                            <Home className='w-6 h-6'/> Shipping Address
                        </h2>
                        <p className="text-gray-100 font-semibold">{order.customerName || 'N/A'}</p>
                        <p className="text-gray-300">{address.address || address.street || 'No street provided'}</p>
                        <p className="text-gray-300">
                            {address.city}, {address.state || 'N/A'} - {address.pinCode}
                        </p>
                        <p className="text-gray-300 mt-2">Phone: {address.phone || 'N/A'}</p>
                        {address.notes && <p className="text-sm text-gray-400 italic mt-2">Notes: {address.notes}</p>}
                    </div>

                </div>

                <div className="lg:col-span-2 space-y-6">
                    
                    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-3">
                            Items Purchased ({items.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Unit Price</th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Qty</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Item Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {items.map((item, index) => (
                                        <tr key={item.id || item.productId || index}>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-100">
                                                <div className="flex items-center">
                                                    <img src={item.image || "data:image/svg+xml;utf8,<svg />"} alt={item.title} className="w-8 h-8 object-cover rounded mr-3" />
                                                    {item.title}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300 text-right">
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm font-bold text-amber-400 text-right">
                                                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">Financial Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-lg text-gray-300">
                                <span>Subtotal (Items):</span>
                                <span>${SUB_TOTAL.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base text-gray-400">
                                <span>Shipping Cost:</span>
                                <span>+ ${SHIPPING_COST.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-3xl font-extrabold text-green-400 border-t border-gray-700 pt-3 mt-3">
                                <span>GRAND TOTAL:</span>
                                <span>${GRAND_TOTAL.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div className='mt-10 text-center text-gray-500'>
                <p>This is your official order record. Please save this information for future reference.</p>
            </div>
        </motion.div>
    );
};

export default OrderDetailsView;
