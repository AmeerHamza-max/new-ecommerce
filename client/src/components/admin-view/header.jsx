import React from "react";
import { LogOut, TextAlignJustify } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminHeader = ({ toggleSidebar }) => {

  // ----------------------------
  // Logout handler with debugging
  // ----------------------------
  const handleLogout = async () => {
    console.log("[AdminHeader] Logout initiated"); // Debugging

    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies
        headers: { "Content-Type": "application/json" },
      });

      console.log("[AdminHeader] Logout response status:", res.status); // Debugging

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("[AdminHeader] Logout response data:", data); // Debugging

      if (data.success) {
        toast({ title: "Logged out successfully" });
        console.log("[AdminHeader] Logout successful, redirecting to login"); // Debugging

        // Clear any stored auth info
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/auth/login";
      } else {
        console.warn("[AdminHeader] Logout failed:", data.message); // Debugging
        toast({ title: data.message || "Logout failed", variant: "destructive" });
      }
    } catch (err) {
      console.error("[AdminHeader] Logout Error:", err); // Debugging
      toast({ title: "Logout failed", variant: "destructive" });
    }
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-neutral-950 border-b border-neutral-800 text-gray-100">
      
      {/* Left: Menu toggle for mobile */}
      <button
        onClick={() => {
          console.log("[AdminHeader] Sidebar toggle clicked"); // Debugging
          toggleSidebar();
        }}
        className="flex items-center gap-2 hover:text-gray-300 transition lg:hidden focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <TextAlignJustify size={22} strokeWidth={1.5} />
        <span className="text-sm md:text-base">Menu</span>
      </button>

      {/* Center: Page title */}
      <h1 className="text-lg md:text-xl font-semibold tracking-wide">Dashboard</h1>

      {/* Right: Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:text-red-400 transition focus:outline-none"
        aria-label="Logout"
      >
        <span className="text-sm md:text-base">Logout</span>
        <LogOut size={20} strokeWidth={1.5} />
      </button>
    </header>
  );
};

export default AdminHeader;
