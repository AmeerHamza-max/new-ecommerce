import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Auth components
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// Admin components
import AdminLayout from "./components/admin-view/layout";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import { AdminFeatures } from "./pages/admin-view/features";

// Shop components
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingDetail from "./pages/shopping-view/details";
import ShoppingCart from "./pages/shopping-view/shopping-cart";

// Other pages
import NotFound from "./pages/not-found";
import { UnauthPage } from "./pages/unauth-page";
import AboutUs from "./pages/shopping-view/AboutUs";
import ContactUs from "./pages/shopping-view/ContactUs";

// Auth utilities
import { checkAuth } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check auth status on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-gray-100">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <UnauthPage />;
    return children;
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Authentication routes */}
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes (protected) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminFeatures />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="features" element={<AdminFeatures />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Shop routes (protected) */}
      <Route
        path="/shop/*"
        element={
          <ProtectedRoute>
            <ShoppingLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="product/:id" element={<ShoppingDetail />} />
        <Route path="cart" element={<ShoppingCart />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* About Us and Contact Us (public pages) */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Unauthenticated page */}
      <Route path="/unauth-page" element={<UnauthPage />} />

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
