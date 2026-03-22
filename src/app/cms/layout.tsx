"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminTopbar } from "@/components/cms/AdminTopbar";
import { AdminSidebar } from "@/components/cms/AdminSidebar";
import { AdminFooter } from "@/components/cms/AdminFooter";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUserStore();

  // Route protection
  useEffect(() => {
    if (!loading && !user && pathname !== "/cms/login") {
      router.push("/cms/login");
    }
  }, [user, loading, pathname, router]);

  // Login page gets its own full-screen layout — no topbar/sidebar
  if (pathname === "/cms/login") {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, don't show the dashboard content (it will redirect anyway)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Topbar — sticky at top */}
      <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body: Sidebar + Main */}
      <div className="mx-auto flex max-w-screen-2xl">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area — fills at least the remaining viewport height */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer — full-width bg, visible on scroll */}
      <AdminFooter />
    </div>
  );
}

