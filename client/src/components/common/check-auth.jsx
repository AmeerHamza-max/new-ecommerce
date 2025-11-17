import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Debug helper
const debugLog = (label, data) => console.log(`[CheckAuth] ${label}:`, data);

/**
 * Role-based route protection
 * - Redirect unauthenticated users to login
 * - Redirect users from auth routes if already logged in
 * - Prevent non-admins from accessing admin routes
 * - Prevent admins from accessing shop routes
 */
const CheckAuth = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname;

  debugLog("Current path", path);
  debugLog("isAuthenticated", isAuthenticated);
  debugLog("user", user);
  debugLog("isLoading", isLoading);

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isShopRoute = path.startsWith("/shop");

  // Wait while checking auth
  if (isLoading) {
    console.log("[CheckAuth] Loading authentication state...");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Unauthenticated user trying to access protected routes
  if (!isAuthenticated && !isAuthRoute) {
    console.warn("[CheckAuth] Unauthenticated user, redirecting to /auth/login");
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated user accessing auth routes
  if (isAuthenticated && isAuthRoute) {
    const redirectPath = user?.role === "admin" ? "/admin/dashboard" : "/shop/home";
    console.log(`[CheckAuth] Authenticated user accessing auth route, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Non-admin trying to access admin routes
  if (isAuthenticated && user?.role !== "admin" && isAdminRoute) {
    console.warn("[CheckAuth] Non-admin trying to access admin route, redirecting to /unauth-page");
    return <Navigate to="/unauth-page" replace />;
  }

  // Admin trying to access shop routes
  if (isAuthenticated && user?.role === "admin" && isShopRoute) {
    console.log("[CheckAuth] Admin trying to access shop route, redirecting to /admin/dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, allow access
  console.log("[CheckAuth] Access granted to", path);
  return children || null;
};

export default CheckAuth;
