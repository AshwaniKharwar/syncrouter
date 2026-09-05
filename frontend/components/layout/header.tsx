"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { useSidebar } from "@/providers/sidebar-provider";
import { useModels } from "@/hooks/use-models";
import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/models": "Models",
  "/dashboard/providers": "Providers",
  "/dashboard/api-keys": "API Keys",
};

type ApiStatus = "checking" | "online" | "offline";

function useApiStatus(): ApiStatus {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        // Any HTTP response (even a 404) proves the API is reachable.
        await fetch(API_BASE_URL, { credentials: "include" });
        if (!cancelled) setStatus("online");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    };

    ping();
    const interval = setInterval(ping, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}

export default function Header() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const { data: models } = useModels();
  const apiStatus = useApiStatus();

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return [{ label: "Dashboard", href: "/dashboard" }, { label: "Overview" }];
    }

    if (pathname.startsWith("/dashboard/models/")) {
      const modelId = pathname.split("/").pop();
      const modelName = models?.find((m) => m.id === modelId)?.name;
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Models", href: "/dashboard/models" },
        { label: modelName || "Model Details" },
      ];
    }

    const currentLabel = ROUTE_LABELS[pathname] || "Page";
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: currentLabel },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/80 px-4 md:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="font-medium text-text-muted hover:text-text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "font-semibold text-text-primary"
                        : "text-text-muted"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right Utility Status */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-text-muted sm:flex">
          <span className="relative flex h-2 w-2">
            {apiStatus === "online" ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </>
            ) : (
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  apiStatus === "checking"
                    ? "bg-text-muted"
                    : "bg-danger"
                )}
              />
            )}
          </span>
          <span className="text-text-secondary">
            {apiStatus === "online"
              ? "API operational"
              : apiStatus === "checking"
              ? "Checking API…"
              : "API unreachable"}
          </span>
        </div>
      </div>
    </header>
  );
}