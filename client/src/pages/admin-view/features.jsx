// --- src/pages/admin/AdminFeatures.jsx (Product Management) ---
import React from 'react';
import { Package, Edit, Trash2, Search, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const DUMMY_PRODUCTS = [
    { id: 'p1', name: 'High-Performance Laptop X5', category: 'Electronics', stock: 15, price: 1299.00, sales: 85, status: 'Active' },
    { id: 'p2', name: 'Organic Cotton T-Shirt', category: 'Apparel', stock: 0, price: 29.99, sales: 502, status: 'Inactive' },
    { id: 'p3', name: 'Ergonomic Office Chair Pro', category: 'Furniture', stock: 240, price: 349.50, sales: 12, status: 'Active' },
    { id: 'p4', name: '4K Ultra HD Camera', category: 'Electronics', stock: 8, price: 699.00, sales: 150, status: 'Active' },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

export const AdminFeatures = () => {
    return (
        <motion.div 
            className="p-6 bg-gray-900 min-h-full text-gray-100 rounded-2xl shadow-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-4xl font-extrabold text-indigo-400 mb-6 flex items-center border-b border-gray-700 pb-3">
                <Package className="w-8 h-8 mr-3" /> Product Inventory Management
            </h1>
            
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                {/* Search Bar */}
                <motion.div className="relative w-full md:w-1/3" variants={itemVariants}>
                    <input
                        type="text"
                        placeholder="Search Products..."
                        className="w-full p-3 pl-10 rounded-xl bg-gray-800 border border-gray-700 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </motion.div>

                {/* Quick Action Button */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-gray-900 font-bold rounded-xl hover:bg-amber-400 transition shadow-lg shadow-amber-900/50"
                >
                    <PlusCircle className="w-5 h-5" /> Add New Product
                </motion.button>
            </div>

            {/* Product Table */}
            <motion.div 
                variants={itemVariants}
                className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mt-6 border border-gray-700"
            >
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/70">
                        <tr>
                            {['Name', 'Category', 'Stock', 'Price', 'Sales', 'Status', 'Actions'].map((header) => (
                                <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {DUMMY_PRODUCTS.map((product, index) => (
                            <motion.tr 
                                key={product.id} 
                                variants={itemVariants} 
                                className="hover:bg-gray-700 transition"
                            >
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                                        ${product.stock > 20 ? 'bg-green-500/20 text-green-400' : 
                                          product.stock > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-amber-400 font-bold">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300 flex items-center">
                                    {product.sales} units
                                    {product.sales > 100 ? (
                                        <TrendingUp className="w-4 h-4 text-green-400 ml-2" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-400 ml-2" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${product.status === 'Active' ? 'bg-indigo-800 text-indigo-100' : 'bg-red-800 text-red-100'}`}
                                    >
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-indigo-400 hover:text-indigo-300 p-2 rounded-full hover:bg-gray-700 transition"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-gray-700 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}