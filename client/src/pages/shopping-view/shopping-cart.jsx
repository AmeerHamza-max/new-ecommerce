import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ShoppingCart = () => {
  const { user } = useSelector((state) => state.auth); // Get the user from the Redux store
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart items from the backend when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/shop/cart/get/${user.id}`);
        setCartItems(res.data.items);
      } catch (err) {
        setError("Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  // Handle empty cart state
  if (loading) return <div>Loading your cart...</div>;
  if (error) return <div>{error}</div>;
  if (!cartItems.length) return <div>Your cart is empty!</div>;

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container p-6">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      
      <div className="cart-items space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="text-lg font-medium">{item.title}</p>
              <p className="text-gray-500">Price: ${item.price}</p>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <button className="text-red-500 hover:underline">Remove</button>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-semibold text-lg mt-6">
        <span>Total Price:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default ShoppingCart;
