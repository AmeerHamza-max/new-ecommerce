// --- src/App.jsx ---
import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// Redux
import { checkAuth } from "./store/auth-slice";
import AdminDashboard from "./pages/admin-view/dashboard";

// Lazy Components
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const ShoppingLayout = lazy(() => import("./components/shopping-view/layout"));

const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminOrdersView = lazy(() => import("./pages/admin-view/orders")); 

const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const ShoppingDetail = lazy(() => import("./pages/shopping-view/details"));
const ShoppingCart = lazy(() => import("./pages/shopping-view/shopping-cart"));

const OrderDetailsPage = lazy(() => import("./pages/shopping-view/orders"));

const MockPayment = lazy(() => import("./pages/Payment/mock-payment"));
const NotFound = lazy(() => import("./pages/not-found"));
const UnauthPage = lazy(() => import("./pages/unauth-page"));
const AboutUs = lazy(() => import("./pages/shopping-view/AboutUs"));
const ContactUs = lazy(() => import("./pages/shopping-view/ContactUs"));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(
    (state) => state.auth || { isAuthenticated: false, isLoading: true }
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <UnauthPage />;
    return children;
  };

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
            Loading Content...
          </div>
        }
      >
        <Routes>
          {/* Root Redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/shop/home" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* Auth Routes */}
          <Route path="/auth/" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrdersView />} /> {/* ✅ correct param */}
            <Route path="features" element={<AdminFeatures />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Shop Routes */}
          <Route
            path="/shop"
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
            <Route path="account/orders/:id" element={<OrderDetailsPage />} />
            <Route path="product/:id" element={<ShoppingDetail />} />
            <Route path="cart" element={<ShoppingCart />} />
            <Route path="payment" element={<MockPayment />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Public Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/unauth-page" element={<UnauthPage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
