"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminTopbar } from "@/components/cms/AdminTopbar";
import { AdminSidebar } from "@/components/cms/AdminSidebar";
import { AdminFooter } from "@/components/cms/AdminFooter";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page gets its own full-screen layout — no topbar/sidebar
  if (pathname === "/cms/login") {
    return <>{children}</>;
  }

  return (
    <>
      <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
        {/* Topbar */}

        {/* Body: Sidebar + Main */}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 overflow-hidden">
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content area */}
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="flex-1 p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>

      </div>
      <AdminFooter /></>
  );
}

