// --- src/pages/admin/AdminDashboard.jsx (Scrollbar Fixed Version) ---
import React from 'react';
import { ShoppingBag, Users, DollarSign, ListOrdered, ChevronRight, BarChart, Package } from 'lucide-react';
import { motion } from 'framer-motion';

// Import the dedicated features component
import { AdminFeatures } from './features'; // Assuming AdminFeatures.jsx is in the same directory

// Utility function to get explicit color classes based on the 'color' prop
const getColorClasses = (color, prefix) => {
    switch (color) {
        case 'green':
            return `${prefix}-green-500 ${prefix}-green-400`; // border/text
        case 'amber':
            return `${prefix}-amber-500 ${prefix}-amber-400`;
        case 'indigo':
            return `${prefix}-indigo-500 ${prefix}-indigo-400`;
        case 'teal':
            return `${prefix}-teal-500 ${prefix}-teal-400`;
        default:
            return '';
    }
};

// Component for a single stat box (using Framer Motion)
const StatCard = ({ icon: Icon, title, value, color, change }) => {
    // Explicitly define border and icon colors for Tailwind to recognize them
    const borderColor = getColorClasses(color, 'border').split(' ')[0]; // e.g., border-green-500
    const iconTextColor = getColorClasses(color, 'text').split(' ')[1]; // e.g., text-green-400

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
            whileHover={{ translateY: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
            // Using explicit classes here
            className={`p-6 rounded-2xl shadow-xl bg-gray-800 border-t-4 ${borderColor} transition-all duration-300 cursor-pointer`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
                {/* Using explicit text color class here */}
                <Icon className={`w-8 h-8 ${iconTextColor} p-1 rounded-full bg-gray-700`} />
            </div>
            <p className="text-5xl font-extrabold text-white mt-2">{value}</p>
            <div className="flex items-center mt-2 text-sm">
                <span className={`font-semibold ${change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
                <span className="text-gray-400 ml-1">vs last month</span>
            </div>
        </motion.div>
    );
};

const AdminDashboard = () => {
    // Dummy Data for Dashboard
    const stats = [
        { icon: DollarSign, title: 'Revenue', value: '$12.4K', color: 'green', change: '+12.5%' },
        { icon: ListOrdered, title: 'New Orders', value: '47', color: 'amber', change: '-4.2%' },
        { icon: Users, title: 'Total Users', value: '1.8K', color: 'indigo', change: '+22.1%' },
        { icon: ShoppingBag, title: 'Conversion Rate', value: '3.4%', color: 'teal', change: '+0.8%' },
    ];

    return (
        // 1. Main container: Changed p-4 md:p-10 to p-4 md:p-8 to control padding,
        // and ensured no unexpected overflow by restricting any potential child width beyond the viewport.
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 overflow-hidden"> 
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-8 tracking-wide border-b border-gray-700 pb-4"
            >
                <ChevronRight className="w-8 h-8 inline-block mr-2" /> E-commerce Admin Panel
            </motion.h1>

            {/* 1. Key Performance Indicators (KPIs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* 2. Charts and Quick Reports Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Sales Chart Placeholder */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center">
                        <BarChart className="w-6 h-6 mr-2" /> Monthly Sales Overview
                    </h2>
                    {/* Placeholder for a real chart library like Recharts or Chart.js */}
                    <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg border-dashed border-2 border-indigo-500/50">
                        <p className="text-gray-500 italic text-center px-4">Chart Placeholder: Revenue vs Orders (Last 6 Months)</p>
                    </div>
                </motion.div>

                {/* Top Products/Alerts */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center">
                        <Package className="w-6 h-6 mr-2" /> Top Selling Product
                    </h2>
                    <div className="p-4 bg-teal-900/30 rounded-lg border border-teal-700 text-teal-300 mb-4">
                        <p className="font-semibold text-lg">Organic Cotton T-Shirt</p>
                        <p className="text-sm">502 Units Sold. (Category: Apparel)</p>
                    </div>

                    <h2 className="text-2xl font-bold text-red-400 mb-4 border-t border-gray-700 pt-4">Critical Alerts</h2>
                    <div className="p-4 bg-red-900/30 rounded-lg border border-red-700 text-red-300">
                        <p className="font-semibold">❌ Failed Payments</p>
                        <p className="text-sm">4 transactions failed in the last 24 hours.</p>
                    </div>
                </motion.div>
            </div>

            {/* 3. Dedicated Feature Component (Product Management) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10"
            >
                {/* AdminFeatures component must manage its own table overflow inside */}
                <AdminFeatures /> 
            </motion.div>
        </div>
    );
};

export default AdminDashboard;