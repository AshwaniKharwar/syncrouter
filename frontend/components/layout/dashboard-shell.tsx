"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useSidebar } from "@/providers/sidebar-provider";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isExpanded, isMobile, mobileOpen, closeMobile } = useSidebar();

  return (
    <div className="relative min-h-screen bg-background text-foreground flex">
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area with dynamic margin */}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 transition-[margin-left] duration-300 ease-in-out",
          isMobile ? "ml-0" : isExpanded ? "ml-64" : "ml-16"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
