// --- src/components/Address.jsx (Checkout Ready with Selectable Address Card) ---

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CommonForm } from "@/components/common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewAddresses,
    fetchAllAddresses,
    editAddress,
    deleteAddress
} from "@/store/shop/address-slice";
import { AddressCard } from "../shopping-view/address-card";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const MAX_ADDRESSES = 3;

const initialAddressFormData = {
    address: "",
    city: "",
    pinCode: "",
    phone: "",
    notes: "",
};

export const Address = ({ setSelectedAddress }) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [isEdit, setIsEdit] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList = [], isLoading = false } = useSelector(state => state.shopAddress || {});

    const canAddNewAddress = addressList.filter(addr => addr && addr._id).length < MAX_ADDRESSES;

    // Fetch all addresses on mount
    useEffect(() => {
        if (user?.id) dispatch(fetchAllAddresses(user.id));
    }, [dispatch, user?.id]);

    // Validation functions
    const isFormValid = () => {
        const { address, city, pinCode, phone } = formData;
        return address.trim() && city.trim() && pinCode.trim() && phone.trim();
    };

    const validateAndToast = () => {
        const { address, city, pinCode, phone } = formData;
        if (address.trim().length < 5) { toast.error("Address must be at least 5 characters."); return false; }
        if (!city.trim()) { toast.error("City is required."); return false; }
        if (!/^[A-Za-z0-9\s]{5,10}$/.test(pinCode)) { toast.error("Pincode must be 5-10 characters."); return false; }
        if (phone.replace(/\D/g, "").length < 10) { toast.error("Phone must be at least 10 digits."); return false; }
        return true;
    };

    // Add or edit address
    const handleManageAddress = async () => {
        if (!user?.id) return toast.error("Please log in.");
        if (!validateAndToast()) return;
        if (isSubmitting) return;
        if (!isEdit && !canAddNewAddress) return toast.error(`Address limit reached (${MAX_ADDRESSES}).`);

        setIsSubmitting(true);
        const payload = { ...formData, userId: user.id };

        try {
            if (isEdit && currentAddressId) {
                await dispatch(editAddress({ userId: user.id, addressId: currentAddressId, formData })).unwrap();
                toast.success("Address updated successfully.");
            } else {
                await dispatch(addNewAddresses(payload)).unwrap();
                toast.success("Address added successfully.");
            }
            setFormData(initialAddressFormData);
            setIsEdit(false);
            setCurrentAddressId(null);
        } catch (error) {
            toast.error("Server error: " + (error?.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit address
    const handleEdit = (addressInfo) => {
        setFormData({
            address: addressInfo.address,
            city: addressInfo.city,
            pinCode: addressInfo.pinCode,
            phone: addressInfo.phone,
            notes: addressInfo.notes || "",
        });
        setIsEdit(true);
        setCurrentAddressId(addressInfo._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete address
    const handleDelete = async (addressId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await dispatch(deleteAddress({ userId: user.id, addressId })).unwrap();
            toast.success("Address deleted successfully.");
            // Clear selection if deleted
            setSelectedAddress(prev => (prev?._id === addressId ? null : prev));
        } catch (error) {
            toast.error("Delete failed: " + (error?.message || "Unknown error"));
        }
    };

    // Select address
    const handleSelectAddress = (address) => {
        setSelectedAddress(address); // Pass full address object to parent
        toast.success(`Selected: ${address.address}, ${address.city}`);
    };

    const isButtonDisabled = !isFormValid() || isLoading || isSubmitting || !user?.id || (!isEdit && !canAddNewAddress);
    const validAddresses = addressList.filter(addr => addr && addr._id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 w-full"
        >
            {/* FORM */}
            <div className="border border-gray-700 p-6 rounded-xl bg-gray-900 shadow-2xl mb-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                    {isEdit ? "✏️ Edit Address" : !canAddNewAddress ? `❌ Limit Reached (${MAX_ADDRESSES})` : "➕ Add New Address"}
                </h3>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={isEdit ? "Update Address" : "Save Address"}
                    buttonClassName="w-full px-4 py-3 text-lg font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 shadow-md"
                    disableButton={isButtonDisabled}
                    onSubmit={handleManageAddress}
                />
                {isEdit && (
                    <motion.button
                        onClick={() => {
                            setIsEdit(false);
                            setCurrentAddressId(null);
                            setFormData(initialAddressFormData);
                        }}
                        className="mt-4 w-full px-4 py-2 text-base font-medium text-red-400 bg-gray-800 border border-red-600 rounded-lg hover:bg-red-900/20 transition shadow-sm"
                    >
                        Cancel Edit
                    </motion.button>
                )}
            </div>

            {/* SAVED ADDRESSES */}
            <h3 className="text-2xl font-bold text-white mb-4">
                Your Saved Addresses ({validAddresses.length})
            </h3>

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                </div>
            )}

            {!isLoading && validAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {validAddresses.map(address => (
                        <AddressCard
                            key={address._id}
                            addressInfo={address}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            isSelected={setSelectedAddress?._id === address._id}
                            handleSelect={() => handleSelectAddress(address)} // full object passed to parent
                        />
                    ))}
                </div>
            ) : (
                !isLoading && <p className="text-gray-400">No addresses found. Add one above.</p>
            )}
        </motion.div>
    );
};
