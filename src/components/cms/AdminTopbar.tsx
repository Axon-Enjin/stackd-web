"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        logout();
        router.push("/cms/login");
        router.refresh();
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1F3B] shadow-lg shadow-black/10">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2F80ED] to-[#2FB7A8] text-xs font-black text-white shadow-md">
            S
          </div>
          <span className="text-lg font-bold tracking-[0.12em] text-white uppercase select-none">
            STACKD
          </span>
        </div>
      </div>

      {/* Right: Avatar dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10"
          aria-label="User menu"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2F80ED] to-[#2FB7A8] shadow-inner">
            <User size={18} className="text-white" />
          </div>
          <ChevronDown
            size={14}
            className={`text-white/50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <LogOut size={16} className="text-gray-400" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  );
}
