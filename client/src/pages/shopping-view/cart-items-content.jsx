import React, { useEffect, useState } from "react";
import ShoppingProductTile from "../shopping-view/product-tile"; // Ensure the correct import path for this component
import axios from "axios";

function UserCartItemsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state to manage error display

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Reset error on each fetch attempt
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later."); // Display an error message
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message
      ) : products.length === 0 ? (
        <p>No products found in your cart.</p>
      ) : (
        products.map((product) => (
          <ShoppingProductTile key={product.id || product._id} product={product} />
        ))
      )}
    </div>
  );
}

export default UserCartItemsContent;
