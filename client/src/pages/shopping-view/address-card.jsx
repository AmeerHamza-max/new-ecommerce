// --- src/components/shopping-view/address-card.jsx (Checkout Ready & Selectable) ---

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, MapPin } from 'lucide-react';

export const AddressCard = ({
    addressInfo,
    handleEdit,
    handleDelete,
    isSelected = false,
    handleSelect
}) => {

    useEffect(() => {
        if (!addressInfo || !addressInfo._id) {
            console.warn("[AddressCard] Invalid addressInfo:", addressInfo);
        }
    }, [addressInfo]);

    if (!addressInfo || typeof addressInfo !== "object") {
        return (
            <div className="p-4 bg-red-900 text-red-300 rounded-lg">
                ⚠️ Address data missing or corrupted — check console.
            </div>
        );
    }

    const { address, city, pinCode, phone, notes } = addressInfo;
    const safeAddress = address || "No Address Provided";
    const safeCity = city || "Unknown City";
    const safePin = pinCode || "N/A";
    const safePhone = phone || "N/A";
    const safeNotes = notes || "";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 100 } }}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer relative"
            onClick={() => handleSelect && handleSelect(addressInfo)} // Entire card selects
        >
            <div className={`bg-gray-800 rounded-xl text-gray-100 shadow-xl flex flex-col justify-between transition-all duration-300
                ${isSelected ? 'border-2 border-indigo-500 shadow-indigo-800/30' : 'border border-gray-700 hover:border-amber-400 hover:shadow-amber-900/30'}`}>
                
                {isSelected && (
                    <div className='absolute top-3 left-3 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10'>
                        SELECTED
                    </div>
                )}

                <div className='grid gap-3 p-6'>
                    <h3 className='text-xl font-bold text-amber-400 border-b border-gray-700 pb-2 mb-1 flex items-center gap-2'>
                        <MapPin className='w-5 h-5 text-indigo-400 flex-shrink-0' />
                        <span className="truncate">Delivery to {safeCity}</span>
                    </h3>

                    <p className="text-gray-300 break-words font-medium pl-7 text-sm">{safeAddress}</p>

                    <div className='flex justify-between items-center text-sm pt-3 gap-2'>
                        <div className='flex items-center gap-1 min-w-0'>
                            <span className='font-medium text-indigo-400 whitespace-nowrap'>Pin:</span>
                            <span className="text-gray-200 font-semibold truncate">{safePin}</span>
                        </div>
                        <div className='flex items-center gap-1 min-w-0'>
                            <span className='font-medium text-indigo-400 whitespace-nowrap'>Ph:</span>
                            <span className="text-gray-200 truncate">{safePhone}</span>
                        </div>
                    </div>

                    {safeNotes.trim() && (
                        <div className='mt-3 pt-3 border-t border-gray-700'>
                            <span className='font-medium text-amber-500 text-sm block mb-1'>Notes:</span>
                            <span className="text-sm text-gray-400 block italic bg-gray-700 p-2 rounded leading-snug truncate">{safeNotes}</span>
                        </div>
                    )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 p-4 bg-gray-700 rounded-b-xl border-t border-gray-600">
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); handleEdit && handleEdit(addressInfo); }}
                        className="px-3 py-2 text-sm font-semibold rounded-lg bg-blue-600/20 text-blue-400 transition duration-150 flex items-center gap-1 border border-blue-600 hover:text-white"
                    >
                        <Edit className="w-4 h-4" /> Edit
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); handleDelete && handleDelete(addressInfo._id); }}
                        className="px-3 py-2 text-sm font-semibold rounded-lg bg-red-600/20 text-red-400 transition duration-150 flex items-center gap-1 border border-red-600 hover:text-white"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
