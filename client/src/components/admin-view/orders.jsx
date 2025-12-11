import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// NOTE: Assume OrderDetailsShared is imported for modal/detail view
import OrderDetailsShared from '../orders/OrderDetailsShared'; 

// --- IMPLICATION: Socket.IO setup (Conceptual) ---
// import { socket } from '../../utils/socket'; 

// Available statuses for admin
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrdersView = () => {
    // State to hold ALL orders
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // For detail modal/view

    // Dummy data for initial structure
    const dummyOrders = [
        { _id: 'ORD1001', date: '2025-11-20', status: 'Shipped', totalAmount: 145.99, customerName: 'Ali Khan', itemsCount: 3, paymentMethod: 'COD' },
        { _id: 'ORD1002', date: '2025-11-15', status: 'Processing', totalAmount: 49.99, customerName: 'Zainab Ahmed', itemsCount: 1, paymentMethod: 'Online' },
        { _id: 'ORD1003', date: '2025-11-01', status: 'Delivered', totalAmount: 220.00, customerName: 'Fahad Malik', itemsCount: 5, paymentMethod: 'Online' },
    ];

    // -------------------- 1. Fetch ALL Orders --------------------
    useEffect(() => {
        // TODO: Replace with actual API call to fetch ALL orders
        // fetchAllOrders().then(data => { setOrders(data); setIsLoading(false); });

        // Mocking API call response
        setTimeout(() => {
            setOrders(dummyOrders);
            setIsLoading(false);
        }, 1200);
    }, []);

    // -------------------- 2. Real-Time Status Listener --------------------
    useEffect(() => {
        // TODO: Implement Socket.IO connection and listener
        /*
        socket.on('orderStatusUpdated', (updatedOrder) => {
            // Update the state with the new order object
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
            toast.info(`External update: Order ${updatedOrder._id} status changed to: ${updatedOrder.status}`);
        });

        return () => {
            socket.off('orderStatusUpdated'); // Cleanup
        };
        */
    }, []);

    // -------------------- 3. Admin Status Update Logic --------------------
    const handleStatusUpdate = useCallback(async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change order ${orderId} status to ${newStatus}?`)) {
            return;
        }

        // Optimistic UI Update (Update state before API call)
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );

        // TODO: Replace with actual Redux Thunk or API call to update status
        // try {
        //     await updateOrderStatusAPI(orderId, newStatus);
        //     toast.success(`Order ${orderId} updated to ${newStatus}`);
        //     // Note: Backend must emit Socket.IO event here to notify all clients
        // } catch (error) {
        //     toast.error(`Failed to update status: ${error.message}`);
        //     // Rollback UI (if API fails, revert state)
        //     setOrders(dummyOrders); // Simple rollback to dummy or fetchAllOrders()
        // }
         toast.success(`Order ${orderId} updated to ${newStatus} (Mock)`);
    }, []);


    if (isLoading) return <div className="text-center p-10 text-gray-400">Loading all orders for Admin...</div>;
    if (orders.length === 0) return <div className="text-center p-10 text-gray-400">No orders found in the system.</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
            <h1 className="text-4xl font-extrabold text-red-500 mb-8 flex items-center gap-3">
                <Zap className="w-8 h-8"/> Admin Order Management ({orders.length})
            </h1>
            
            {/* Table View for Admin */}
            <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">Status Control</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-700 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">{order._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-bold">${order.totalAmount.toFixed(2)}</td>
                                
                                {/* Status Control Dropdown */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-white"
                                    >
                                        {STATUSES.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                
                                {/* Actions Buttons */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-indigo-400 hover:text-indigo-300 mr-3 p-1 rounded hover:bg-gray-600"
                                        title="View Details"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => toast.error(`Deletion not yet implemented for ${order._id}`)}
                                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-600"
                                        title="Delete/Cancel Order"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal/Detail View */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative"
                    >
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition font-bold"
                        >
                            Close
                        </button>
                        <OrderDetailsShared order={selectedOrder} />
                        
                        {/* Status Control inside detail view */}
                         <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                            <h4 className="text-xl font-bold text-red-300 mb-3">Quick Status Change</h4>
                            <div className="flex gap-2 flex-wrap">
                                {STATUSES.map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                                        disabled={selectedOrder.status === status}
                                        className={`p-2 rounded font-bold text-sm transition ${
                                            selectedOrder.status === status 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        }`}
                                    >
                                        Set to {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersView;