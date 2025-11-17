import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ShoppingHeader } from './header';
import { useSelector } from 'react-redux';

const ShoppingLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("[ShoppingLayout] Render", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  return (
    <div className='flex flex-col min-h-screen bg-neutral-950 text-gray-200 overflow-hidden'>
      
      {/* Header */}
      <ShoppingHeader />

      {/* Main Content */}
      <main
        role="main"
        className='flex flex-col flex-1 bg-neutral-900 p-4 md:p-8 rounded-t-2xl shadow-inner'
      >
        <Outlet />
      </main>

    </div>
  );
};

export default ShoppingLayout;
