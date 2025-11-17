import React, { useEffect, useState } from "react";
import { CommonForm } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} from "../../store/admin/product-slice";
import { toast } from "@/hooks/use-toast";
import AdminProductTile from "./product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList = [], isLoading = false } = useSelector(
    (state) => state.adminProducts || {}
  );

  // ---------------------------
  // Drawer Controls
  // ---------------------------
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoadingState(false);
    setCurrentEditedId(null);
  };

  // ---------------------------
  // Check if any field is empty (excluding image)
  // ---------------------------
  const isFormIncomplete = () => {
    return Object.entries(formData).some(([key, value]) => {
      if (key === "image") return false;
      if (typeof value === "number") return value === null || value === undefined;
      return !value || value === "";
    });
  };

  // ---------------------------
  // Add or Edit Product
  // ---------------------------
  const handleSubmit = async () => {
    console.log("Submitting FormData:", formData);
    console.log("UploadedImageUrl:", uploadedImageUrl, "ImageLoading:", imageLoadingState);

    if (isFormIncomplete()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (!uploadedImageUrl || imageLoadingState) {
      toast({ title: "Please upload a valid image", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const payload = { ...formData, image: uploadedImageUrl };

    try {
      let resultAction;
      if (currentEditedId) {
        resultAction = await dispatch(
          editProduct({ id: currentEditedId, formData: payload })
        );
      } else {
        resultAction = await dispatch(addNewProduct(payload));
      }

      console.log("Add/Edit Result:", resultAction);

      const success = resultAction?.payload?.success || false;
      const message = resultAction?.payload?.message || "Unexpected Error";

      if (success) {
        await dispatch(fetchAllProducts());
        toast({
          title: currentEditedId
            ? "Product Updated Successfully"
            : "Product Added Successfully",
        });

        // Reset form after success
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl("");
        setCurrentEditedId(null);
        setIsDrawerOpen(false);
      } else {
        toast({ title: message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast({ title: "Unexpected Error", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // Edit button click — populate all fields
  // ---------------------------
  const handleEdit = (product) => {
    setFormData({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      totalStock: product.totalStock || "",
      image: product.image || null,
    });
    setUploadedImageUrl(product.image);
    setImageFile(null);
    setImageLoadingState(false);
    setCurrentEditedId(product._id);
    openDrawer();
    console.log("Editing Product:", product);
  };

  // ---------------------------
  // Delete button click
  // ---------------------------
  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.title}"?`);
    if (!confirmed) return;

    try {
      const resultAction = await dispatch(deleteProduct(product._id));
      console.log("Delete Result:", resultAction);

      const success = resultAction?.payload?.success || false;
      const message = resultAction?.payload?.message || "Unexpected Error";

      if (success) {
        await dispatch(fetchAllProducts());
        toast({ title: "Product Deleted Successfully" });
      } else {
        toast({ title: message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast({ title: "Unexpected Error", variant: "destructive" });
    }
  };

  // ---------------------------
  // Fetch all products on mount
  // ---------------------------
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <>
      {/* Add Product Button */}
      <div className="mb-5 flex justify-end w-full relative z-20">
        <Button
          onClick={openDrawer}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          Add New Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10">
        {isLoading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : productList.length > 0 ? (
          productList.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-400">No products found.</p>
        )}
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-neutral-950 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-bold text-gray-100">
            {currentEditedId ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={closeDrawer}
            className="text-gray-100 hover:text-red-400 transition text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)] space-y-4">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            disabled={false} // Set true if you want image non-editable
          />

          <CommonForm
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            buttonText={
              submitting
                ? currentEditedId
                  ? "Updating..."
                  : "Submitting..."
                : currentEditedId
                ? "Update Product"
                : "Add Product"
            }
            showButton={true}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}
    </>
  );
};

export default AdminProducts;
