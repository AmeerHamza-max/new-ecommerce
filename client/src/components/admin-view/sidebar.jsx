import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket, X } from "lucide-react";

const adminSidebarMenuItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", path: "/admin/products", icon: ShoppingBasket },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: BadgeCheck },
];

// -----------------------------
// MenuItems Component
// -----------------------------
const MenuItems = ({ onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map(({ id, label, path, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <div
            key={id}
            role="button"
            tabIndex={0}
            onClick={() => {
              console.log(`[AdminSidebar] Navigating to ${path}`); // Debug
              navigate(path);
              onClick?.();
            }}
            onKeyDown={(e) => {
              if (["Enter", " "].includes(e.key)) {
                console.log(`[AdminSidebar] Keyboard navigation to ${path}`); // Debug
                navigate(path);
                onClick?.();
              }
            }}
            className={`flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-colors ${
              isActive ? "bg-neutral-800" : "hover:bg-neutral-800"
            }`}
          >
            <Icon size={20} className="text-gray-100" />
            <span>{label}</span>
          </div>
        );
      })}
    </nav>
  );
};

// -----------------------------
// AdminSidebar Component
// -----------------------------
const AdminSidebar = ({ onMobileItemClick, onCloseMobile }) => {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    console.log("[AdminSidebar] Brand clicked, navigating to /admin/dashboard"); // Debug
    navigate("/admin/dashboard");
    onMobileItemClick?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Section: Branding + Mobile Close */}
      <div className="flex items-center justify-between mb-6">
        <div
          role="button"
          tabIndex={0}
          onClick={handleBrandClick}
          onKeyDown={(e) => { if (["Enter", " "].includes(e.key)) handleBrandClick(); }}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} className="text-gray-100" />
          <h1 className="text-xl font-extrabold text-gray-100">Admin Panel</h1>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close Sidebar"
            className="lg:hidden p-2 hover:bg-neutral-800 rounded-md transition"
          >
            <X size={20} className="text-gray-100" />
          </button>
        )}
      </div>

      <MenuItems onClick={onMobileItemClick} />
    </div>
  );
};

export default AdminSidebar;
