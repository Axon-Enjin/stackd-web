"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Award,
  MessageSquareQuote,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/cms",
    icon: LayoutDashboard,
  },
  {
    label: "Team Members",
    href: "/cms/team-members",
    icon: Users,
  },
  {
    label: "Certifications",
    href: "/cms/certifications",
    icon: Award,
  },
  {
    label: "Testimonials",
    href: "/cms/testimonials",
    icon: MessageSquareQuote,
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/cms") return pathname === "/cms";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col
          border-r border-gray-200/80 bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          md:static md:z-auto md:h-auto md:self-stretch md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 md:hidden">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Content
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-[#0B1F3B] text-white shadow-md shadow-[#0B1F3B]/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition-colors ${active
                      ? "text-[#2FB7A8]"
                      : "text-gray-400 group-hover:text-gray-600"
                    }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / branding */}
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-[11px] font-medium text-gray-300 tracking-wider">
            STACKD CMS v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
