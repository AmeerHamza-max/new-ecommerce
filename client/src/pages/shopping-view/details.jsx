import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchProductReviews,
  addProductReview,
  editProductReviewThunk,
  deleteProductReviewThunk,
  updateRating,
} from "@/store/shop/product-slice";
import { X, ArrowLeft, Star, Edit2, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ShoppingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, error, productReviews } = useSelector(
    (state) => state.shopProducts
  );

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // ✅ success animation
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(0);

  const log = (context, data) => console.log(`[ShoppingDetail] ${context}:`, data);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductDetails(id)).unwrap().catch(console.error);
    dispatch(fetchProductReviews(id)).unwrap().catch(console.error);
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails?.rating) setRating(productDetails.rating);
  }, [productDetails]);

  const handleRating = async (newRating) => {
    setRating(newRating);
    setSubmitSuccess(false);
    try {
      await dispatch(updateRating({ productId: productDetails._id, rating: newRating })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || rating === 0) return alert("Enter review and rating.");

    setSubmitting(true);
    try {
      await dispatch(
        addProductReview({
          productId: productDetails._id,
          reviewData: { rating, comment: reviewText.trim(), userName: "You" },
        })
      ).unwrap();
      setReviewText("");
      setRating(0);
      setHovered(0);
      setSubmitSuccess(true); // ✅ trigger success animation
      setTimeout(() => setSubmitSuccess(false), 2000);
      await dispatch(fetchProductReviews(productDetails._id)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditingText(review.comment);
    setEditingRating(review.rating);
  };

  const saveEditing = async (reviewId) => {
    if (!editingText.trim() || editingRating === 0) return alert("Review text and rating cannot be empty");
    try {
      await dispatch(
        editProductReviewThunk({
          productId: productDetails._id,
          reviewId,
          reviewData: { comment: editingText.trim(), rating: editingRating },
        })
      ).unwrap();
      setEditingReviewId(null);
      setEditingText("");
      setEditingRating(0);
      await dispatch(fetchProductReviews(productDetails._id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await dispatch(deleteProductReviewThunk({ productId: productDetails._id, reviewId })).unwrap();
      await dispatch(fetchProductReviews(productDetails._id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-800">Loading product...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  if (!productDetails) return <div className="flex items-center justify-center min-h-screen text-gray-700">Product not found</div>;

  const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="flex items-center justify-center min-h-screen p-4 bg-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <button onClick={() => window.history.back()} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"><X size={28} /></button>

        <div className="p-6 md:p-10">
          <motion.div className="flex flex-col md:flex-row gap-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.img src={productDetails.image || ""} alt={productDetails.title || "Product"} className="w-full md:w-1/3 h-64 md:h-96 object-contain rounded-lg border border-gray-200 shadow-sm" variants={itemVariants} />

            <motion.div className="flex-1 flex flex-col gap-4" variants={itemVariants}>
              <motion.h1 className="text-4xl font-extrabold text-gray-900">{productDetails.title}</motion.h1>
              <motion.p className="text-gray-800">{productDetails.description}</motion.p>

              <motion.div className="flex flex-wrap gap-3 mt-2">
                {productDetails.category && <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">Category: {productDetails.category}</span>}
                {productDetails.brand && <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">Brand: {productDetails.brand}</span>}
              </motion.div>

              <motion.p className="text-3xl font-bold mt-4 text-gray-900">${productDetails.salePrice || productDetails.price || 0}</motion.p>

              {/* Rating with pop animation */}
              <motion.div className="flex items-center gap-3 mt-3">
                {[...Array(5)].map((_, i) => {
                  const index = i + 1;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 1.5, rotate: [0, -10, 10, 0] }}
                      onClick={() => handleRating(index)}
                      className={`cursor-pointer transition-colors ${index <= (hovered || rating) ? "text-amber-400" : "text-gray-300"}`}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(0)}
                    >
                      <Star className="w-6 h-6" />
                    </motion.div>
                  );
                })}
                <span className="text-sm text-gray-600 ml-1">{rating > 0 ? `${rating} / 5` : "No rating yet"}</span>
              </motion.div>

              {/* Review form with submit success animation */}
              <motion.form onSubmit={handleSubmitReview} className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Write a Review</h3>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your thoughts..." className="w-full h-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900" disabled={submitting} />
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={submitting} className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg shadow transition disabled:opacity-50">
                  {submitting ? "Submitting..." : "Post Review"}
                </motion.button>

                {/* Success check animation */}
                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1.2 }} exit={{ opacity: 0, scale: 0 }} className="absolute top-0 right-0 m-4 bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Check size={16} /> Submitted!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>

              <Link to="/shop/listing" className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-gray-100 hover:bg-gray-800 rounded-lg font-medium shadow-md transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Products
              </Link>
            </motion.div>
          </motion.div>

          {/* Review list */}
          <motion.div className="mt-12" variants={containerVariants} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900">Customer Reviews</h2>
            {productReviews?.length > 0 ? (
              <AnimatePresence>
                {productReviews.map((rev, idx) => (
                  <motion.div key={rev._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (editingReviewId === rev._id ? editingRating : rev.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{rev.userName || "Anonymous"}</span>
                      <div className="ml-auto flex gap-2">
                        <button onClick={() => startEditing(rev)} className="text-blue-500 hover:text-blue-700"><Edit2 size={16} /></button>
                        <button onClick={() => deleteReview(rev._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {editingReviewId === rev._id ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                        <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full p-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 cursor-pointer ${i < editingRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} onClick={() => setEditingRating(i + 1)} />
                          ))}
                          <button onClick={() => saveEditing(rev._id)} className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1">
                            <Check size={14} /> Save
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-700 text-sm">{rev.comment}</motion.p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">No reviews yet. Be the first to review.</motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShoppingDetail;
