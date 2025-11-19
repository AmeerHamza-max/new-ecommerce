import React, { useState, useRef, useEffect } from "react";
// Zaroori icons import kiye gaye hain
import { Menu, ShoppingCart, X, User, LogOut, Search } from "lucide-react"; 
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../../store/shop/cart-slice"; // Cart data fetch karne ke liye
import { logoutUser } from "@/store/auth-slice"; // User logout ke liye
import UserCartWrapper from "../../pages/shopping-view/cart-wrapper"; // Corrected Cart component
import { shoppingViewHeaderMenuItems } from "@/config"; // Menu items

export const ShoppingHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search term ke liye state
  const [searchTerm, setSearchTerm] = useState(''); 

  // Nayi State: Search box ki visibility control karne ke liye
  const [isSearchOpen, setIsSearchOpen] = useState(false); 

  // Redux state access
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.shoppingCart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const mobileMenuRef = useRef(null);
  // const [menuHeight, setMenuHeight] = useState(0); // Not strictly needed if using scrollHeight directly in style
  
  // Search box animation ke liye ref
  const searchBoxRef = useRef(null); 

  // Cart mein kul items ki ginti
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );
    
  // Cart ka total amount calculate karna (for checkout footer)
  const totalAmount = cartItems.reduce(
      (total, item) => total + (item.salePrice || item.price || 0) * (item.quantity || 0),
      0
  );


  // Username se initials nikalne ka function (Avatar ke liye)
  const getUserInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // User ko logout karna
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login"); // Login page par redirect
    setUserMenuOpen(false);
    // Logout par search box band karo
    setIsSearchOpen(false); 
  };

  // Cart icon par click hone par
  const handleCartClick = () => {
    if (!user?.id) return navigate("/auth/login"); // Agar user login nahi hai to login par bhejo

    // Cart data fetch karo aur phir cart sheet kholo
    dispatch(fetchCart(user.id))
      .unwrap()
      .then(() => setOpenCartSheet(true))
      .catch((err) => console.error("Error fetching cart:", err));
      
    // Cart open hone par search box band karo
    setIsSearchOpen(false); 
  };
  
  // Search form submit hone par (Search Logic)
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      
      const targetPath = '/shop/listing'; 

      if (searchTerm.trim()) {
        navigate(`${targetPath}?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm(''); // Submission ke baad input clear karo
      } else {
        navigate(targetPath);
      }
        
      setMobileMenuOpen(false); // Mobile menu band karo
      setIsSearchOpen(false); // Search submit hone par search box band karo
  };


  // Mobile menu transition ke liye height calculate karna (Re-added, though scrollHeight is used directly)
  useEffect(() => {
    // Yahan setMenuHeight hataya jaa sakta hai agar aap direct scrollHeight use kar rahe hain
    // Lekin state aur ref ko ek saath use karne ka pattern transition ko smooth rakhta hai.
    // Filhal, isko hata diya hai, kyonki direct style mein access ho raha hai.
  }, [mobileMenuOpen, isAuthenticated, cartItems]);
  
  // Search state change hone par, focus karo
  useEffect(() => {
    if (isSearchOpen && searchBoxRef.current) {
      // Focus search input on open
      const input = searchBoxRef.current.querySelector('input');
      if(input) input.focus(); 
    }
  }, [isSearchOpen]);
  
  // Click-outside listener (Search box aur User menu ko band karne ke liye)
  useEffect(() => {
    const handleClickOutside = (event) => {
      
      // Search Box (Desktop only, Mobile uses dropdown)
      if (
        isSearchOpen && 
        searchBoxRef.current && 
        !searchBoxRef.current.contains(event.target) &&
        !event.target.closest('[data-search-button]')
      ) {
        if (window.innerWidth >= 1024) { // lg breakpoint
          setIsSearchOpen(false);
          setSearchTerm(''); // Clear search on close
        }
      }
      
      // User Menu
      if (
          userMenuOpen && 
          !event.target.closest('.user-menu-button') && 
          !event.target.closest('.user-menu-dropdown')
      ) {
          setUserMenuOpen(false);
      }
      
      // Cart Sheet
      if (
          openCartSheet &&
          !event.target.closest('.cart-sheet-drawer') &&
          !event.target.closest('[data-cart-button]')
      ) {
          setOpenCartSheet(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, userMenuOpen, openCartSheet]);


  // Menu Items ka reusable component
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
      {/* Top Row (Logo, Desktop Nav/Search, Icons) */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* 1. Logo */}
        <Link
          to="/shop/home"
          className="flex items-center text-gray-100" 
        >
          {/* Stylish Store Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-700 via-purple-600 to-amber-500 shadow-xl transform hover:rotate-6 transition duration-300">
              <span className="text-lg font-black text-black">
                SH
              </span>
          </div>
            <span className="hidden sm:inline-block text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              STORE
            </span>
          </div>
        </Link>

        {/* 2. Center Content (Desktop Menu / Search Bar) - MAIN AREA */}
        <div className="hidden lg:flex flex-1 justify-center relative mx-4">
          
          {/* Content Wrapper for Menu and Search Toggle */}
          <div className={`flex items-center justify-center transition-opacity duration-300 ${isSearchOpen ? 'w-full max-w-lg' : 'w-auto'}`}>
          
            {/* Search Bar - Open hone par Menu ko replace karega */}
            <div 
                ref={searchBoxRef} 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full opacity-100 translate-y-0' : 'w-0 opacity-0 pointer-events-none translate-y-full'}`}
                // Absolute position aur translate-y-full se animation behtar lagega
            >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:border-amber-500 transition placeholder:text-gray-500"
                    />
                    <button 
                        type="submit"
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-amber-500"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Desktop Menu Links + Search Toggle Button */}
            <div 
                className={`flex items-center gap-6 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {isAuthenticated && <MenuItems />}

                {/* Search Icon button (Desktop Only) - Menu ke saath dikhega */}
                <button
                    data-search-button
                    onClick={() => setIsSearchOpen(true)} // Sirf open karega, X se band hoga
                    className="relative p-2 rounded-md hover:bg-gray-800 transition"
                >
                    <Search className="w-6 h-6 text-gray-100" />
                </button>
            </div>

            {/* Close Button for Search (Desktop Only) - Search Open hone par Menu ki jagah dikhega */}
            <button
                data-search-button // Click-outside logic ke liye rakha hai
                onClick={() => {
                    setIsSearchOpen(false); 
                    setSearchTerm('');
                }}
                className={`absolute p-2 rounded-md hover:bg-gray-800 transition z-20 ${isSearchOpen ? 'opacity-100 right-0' : 'opacity-0 pointer-events-none'}`}
            >
                <X className="w-6 h-6 text-gray-100" />
            </button>

          </div>
        </div>

        {/* 3. Right Side Icons (Cart & User Menu) */}
        <div className="flex items-center gap-4 relative">
            
            {/* Search Icon button (Mobile Only) */}
            <button
                data-search-button
                onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                    if (openCartSheet) setOpenCartSheet(false); // Cart band karo
                }}
                className="lg:hidden relative p-2 rounded-md hover:bg-gray-800 transition" 
            >
                {isSearchOpen ? (
                  <X className="w-6 h-6 text-gray-100" />
                ) : (
                  <Search className="w-6 h-6 text-gray-100" />
                )}
            </button>

            {isAuthenticated && (
                <>
                {/* Cart Button */}
                <button
                    data-cart-button // Click-outside logic ke liye
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

                {/* Cart Sheet (Side Drawer) - FIX implemented here for structure and content */}
                {openCartSheet && (
                    <div className="fixed inset-0 z-[60] flex"> {/* z-index 60 for safety */}
                        {/* Overlay/Background Click Area */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={() => setOpenCartSheet(false)}
                        ></div>

                        {/* Main Drawer Container */}
                        <div 
                            className="cart-sheet-drawer ml-auto h-full w-80 sm:w-96 bg-gray-900 border-l border-gray-700 shadow-xl animate-slide-in relative flex flex-col"
                        >
                            {/* 1. Header (Fixed) */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h2 className="text-gray-100 font-semibold text-lg">
                                    {user?.username}'s Cart
                                </h2>
                                <button 
                                    onClick={() => setOpenCartSheet(false)}
                                    className="p-1 rounded-full hover:bg-gray-700 transition"
                                >
                                    <X className="w-5 h-5 text-gray-100" />
                                </button>
                            </div>

                            {/* 2. Cart Content (Scrollable Area) */}
                            {/* h-[calc(100% - total fixed height of header/footer)] */}
                            <div className="flex-1 overflow-y-auto"> 
                                <UserCartWrapper userId={user?.id} />
                            </div>
                            
                            {/* 3. Checkout Button (Fixed Footer) */}
                            <div className="p-4 border-t border-gray-700 bg-gray-900 sticky bottom-0">
                                {/* Total Display */}
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-100 font-semibold">Total: </span>
                                    <span className="text-gray-100 font-bold text-lg">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigate("/checkout"); 
                                        setOpenCartSheet(false);
                                    }}
                                    className="w-full py-3 text-sm font-bold rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition disabled:opacity-50"
                                    disabled={cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>

                        </div> {/* Closes Main Drawer Container */}
                    </div>
                )}

                {/* User Menu (Desktop Dropdown) */}
                <div className="relative z-10 hidden lg:block user-menu-dropdown">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="user-menu-button px-3 py-1 rounded-full bg-gray-800 text-white flex items-center font-medium hover:bg-gray-700 transition"
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
                </>
            )}
        </div>

        {/* Mobile Menu Button (Hamburger/X) */}
        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            if (isSearchOpen) setIsSearchOpen(false); // Mobile menu open hone par search box band karo
            if (openCartSheet) setOpenCartSheet(false); // Cart band karo
          }}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-800 transition"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-100" />
          ) : (
            <Menu className="h-6 w-6 text-gray-100" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Content */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden overflow-hidden bg-black border-t border-gray-800 transition-all duration-700 ease-in-out"
        // Mobile Menu ki height ko dynamically control kiya gaya hai
        style={{ maxHeight: `${mobileMenuOpen ? mobileMenuRef.current?.scrollHeight + 'px' : 0}` }}
      >
        {/* Mobile Search Bar - isSearchOpen se control hoga */}
        <div 
            className={`transition-all duration-500 ease-in-out ${isSearchOpen ? 'p-4 border-b border-gray-800' : 'max-h-0 overflow-hidden p-0'}`}
        >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:border-amber-500 transition placeholder:text-gray-500"
                />
                <button 
                    type="submit"
                    className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-amber-500"
                >
                    <Search className="w-5 h-5" />
                </button>
            </form>
        </div>
        
        {/* Main Mobile Menu Links */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="flex flex-col gap-4 p-4">
            
            {/* Mobile Menu Links */}
            <MenuItems onClick={() => setMobileMenuOpen(false)} />

            {/* Mobile Cart Button (Navigates to cart page or opens sheet if desired) */}
            <button
              onClick={() => {
                  setMobileMenuOpen(false); // Close mobile menu
                  handleCartClick(); // Opens cart sheet
              }}
              className="relative p-2 rounded-md hover:bg-gray-800 transition w-full text-left flex items-center justify-between text-gray-100 font-medium"
            >
              <span>View Cart</span>
              <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
              </span>
            </button>
            
            {/* Mobile Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-sm flex items-center gap-2 hover:bg-gray-800 transition text-gray-100"
            >
                <LogOut className="w-4 h-4" /> Logout ({user?.username})
            </button>
          </div>
        )}
      </div>

      {/* Custom Tailwind Animations */}
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