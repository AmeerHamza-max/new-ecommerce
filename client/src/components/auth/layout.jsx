import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = ({ isAuthenticated, user }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("[AuthLayout] Current path:", location.pathname); // Debug: track current route
    console.log("[AuthLayout] isAuthenticated:", isAuthenticated); // Debug: track auth state
    console.log("[AuthLayout] user:", user); // Debug: track user info
  }, [location, isAuthenticated, user]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-800 text-white">
      
      {/* Left Section (Large screens) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-neutral-900 via-zinc-800 to-neutral-950 px-12">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-amber-400">
            Welcome to My E-Commerce App
          </h1>
          <p className="text-gray-300 text-lg font-medium">
            Explore premium products and enjoy a seamless shopping experience.
          </p>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex flex-1 items-center justify-center px-6 py-8 bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-800">
        <Outlet />
      </div>

    </div>
  );
};

export default AuthLayout;
