import React, { useState, useRef, useEffect } from "react";
import { HousePlug, Menu, ShoppingCart, X, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../../store/shop/cart-slice";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "../../pages/shopping-view/cart-wrapper";
import { shoppingViewHeaderMenuItems } from "@/config";

export const ShoppingHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.shoppingCart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const mobileMenuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );

  const getUserInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
    setUserMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!user?.id) return navigate("/auth/login");

    dispatch(fetchCart(user.id))
      .unwrap()
      .then(() => setOpenCartSheet(true))
      .catch((err) => console.error("Error fetching cart:", err));
  };

  // Correct filtering route: /shop?category=
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (mobileMenuRef.current) {
      setMenuHeight(
        mobileMenuOpen ? mobileMenuRef.current.scrollHeight : 0
      );
    }
  }, [mobileMenuOpen, isAuthenticated, cartItems]);

  const MenuItems = ({ onClick }) => (
    <nav className="flex flex-col lg:flex-row items-center justify-center gap-6">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Link
          key={menuItem.id}
          to={menuItem.path}
          className="text-gray-100 text-sm font-medium hover:text-amber-500 transition"
          onClick={onClick}
        >
          {menuItem.label}
        </Link>
      ))}

      
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black">
      {/* Top Row */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/shop/home"
          className="flex items-center gap-2 text-gray-100"
        >
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center">
          {isAuthenticated && <MenuItems />}
        </div>

        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-4 relative">
            {/* Cart Button */}
            <button
              className="relative p-2 rounded-md hover:bg-gray-800 transition"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-6 h-6 text-gray-100" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Sheet */}
            {openCartSheet && (
              <div className="fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                  onClick={() => setOpenCartSheet(false)}
                ></div>

                <div className="ml-auto h-full w-80 sm:w-96 bg-gray-900 border-l border-gray-700 shadow-xl animate-slide-in">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-gray-100 font-semibold text-lg">
                      {user?.username}'s Cart
                    </h2>
                    <button onClick={() => setOpenCartSheet(false)}>
                      <X className="w-5 h-5 text-gray-100" />
                    </button>
                  </div>

                  <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                    <UserCartWrapper userId={user?.id} />
                  </div>
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="px-3 py-1 rounded-full bg-gray-800 text-white flex items-center font-medium hover:bg-gray-700 transition"
              >
                {getUserInitials(user?.username)}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-gray-100 rounded-md shadow-lg animate-menu-open">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {user?.username}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-700 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-800 transition"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-100" />
          ) : (
            <Menu className="h-6 w-6 text-gray-100" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden overflow-hidden bg-black border-t border-gray-800 transition-all duration-700 ease-in-out"
        style={{ maxHeight: `${menuHeight}px` }}
      >
        {isAuthenticated && (
          <div className="flex flex-col gap-4 p-4">
            <MenuItems onClick={() => setMobileMenuOpen(false)} />

            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-md hover:bg-gray-800 transition w-full text-left flex items-center justify-between"
            >
              <span>Cart</span>
              <span>{totalItems}</span>
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-in {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.7s ease-in-out forwards;
        }

        @keyframes menu-open {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-menu-open {
          animation: menu-open 0.5s ease-in-out forwards;
        }
      `}</style>
    </header>
  );
};
