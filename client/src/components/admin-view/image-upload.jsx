import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast"; // optional toast for better debugging UX

// -----------------------------
// Skeleton Loader
// -----------------------------
const Skeleton = () => (
  <div className="w-full px-4 py-2">
    <div className="animate-pulse flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-700 rounded"></div>
        <div className="w-32 h-4 bg-gray-700 rounded"></div>
      </div>
      <div className="w-5 h-5 bg-gray-700 rounded"></div>
    </div>
    <div className="mt-3 h-2 bg-gray-700 rounded w-3/4 animate-pulse"></div>
  </div>
);

// -----------------------------
// Product Image Upload Component
// -----------------------------
const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  // -----------------------------
  // Reset Selected Image
  // -----------------------------
  const resetImage = () => {
    console.log("[ProductImageUpload] Resetting image"); // Debug
    setImageFile(null);
    setUploadedImageUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // -----------------------------
  // Handle File Selection
  // -----------------------------
  const handleFileSelection = (file) => {
    console.log("[ProductImageUpload] Selected file:", file?.name); // Debug
    if (!file) return;
    setImageFile(file);
    setUploadedImageUrl("");
    setError("");
  };

  // -----------------------------
  // Handle Drag and Drop Upload
  // -----------------------------
  const handleDragDrop = (event) => {
    event.preventDefault();
    console.log("[ProductImageUpload] File dropped"); // Debug
    handleFileSelection(event.dataTransfer.files?.[0]);
  };

  // -----------------------------
  // Auto-upload when imageFile changes
  // -----------------------------
  useEffect(() => {
    if (!imageFile) return;

    const uploadImage = async () => {
      console.log("[ProductImageUpload] Uploading file:", imageFile.name); // Debug
      setImageLoadingState(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("my_file", imageFile);

        const { data } = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("[ProductImageUpload] Upload Response:", data);

        // Flexible backend response handling
        const uploadedUrl = data?.data?.url || data?.data?.filePath || data?.url;
        if (data?.success && uploadedUrl) {
          setUploadedImageUrl(uploadedUrl);
          console.log("[ProductImageUpload] Image uploaded successfully:", uploadedUrl); // Debug
          toast?.({ title: "Image uploaded successfully" }); // optional
        } else {
          throw new Error(data?.message || "Upload failed");
        }
      } catch (err) {
        console.error("[ProductImageUpload] Upload Error:", err);
        setError("Image upload failed: " + err.message);
        toast?.({ title: "Image upload failed", variant: "destructive" }); // optional
      } finally {
        setImageLoadingState(false);
      }
    };

    uploadImage();
  }, [imageFile, setImageLoadingState, setUploadedImageUrl]);

  // -----------------------------
  // Render Component UI
  // -----------------------------
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <label className="text-lg font-semibold mb-2 block">Upload Image</label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="flex items-center justify-center h-32 border border-dashed border-neutral-700 rounded-md bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer focus:outline-none"
      >
        {!imageFile ? (
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-400 text-sm">
              Drag & drop or click to upload image
            </span>
          </div>
        ) : imageLoadingState ? (
          <Skeleton />
        ) : (
          <div className="flex items-center justify-between w-full px-3">
            <div className="flex items-center gap-2">
              <FileIcon className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-gray-200">{imageFile.name}</p>
            </div>
            <button
              type="button"
              onClick={resetImage}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <XIcon className="w-5 h-5" />
              <span className="sr-only">Remove File</span>
            </button>
          </div>
        )}
      </div>

      {/* Display Error */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* File Input */}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileSelection(e.target.files?.[0])}
      />

      {/* Uploaded Image Preview */}
      {uploadedImageUrl && !error && (
        <div className="mt-4">
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="w-full h-48 object-contain rounded-md border border-neutral-700"
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
