"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

import { SyncRouterIcon } from "@/components/shared/sync-router-logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useSidebar } from "@/providers/sidebar-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/models", label: "Models", icon: Sparkles },
  { href: "/dashboard/providers", label: "Providers", icon: Network },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isExpanded, toggleSidebar, isMobile, mobileOpen, closeMobile } =
    useSidebar();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeMobile();
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-bg py-4 transition-all duration-300 ease-in-out",
        isMobile
          ? mobileOpen
            ? "w-64 translate-x-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            : "-translate-x-full w-64"
          : isExpanded
          ? "w-64"
          : "w-16"
      )}
    >
      {/* Top Header / Logo Section */}
      {isExpanded ? (
        <div className="mb-6 flex h-10 w-full items-center gap-2.5 px-3">
          {/* Flat Logo Toggle Button - 40x40px consistent badge */}
          <Tooltip>
            <TooltipTrigger
              render={<button />}
              onClick={toggleSidebar}
              className="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-surface-hover shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:bg-surface-hover hover:border-accent active:scale-95"
              aria-label="Collapse sidebar"
            >
              {/* Default SyncRouter Logo Icon (hidden on hover) */}
              <SyncRouterIcon size={20} className="transition-all duration-200 group-hover:scale-75 group-hover:opacity-0" />
              {/* Toggle Icon (revealed on hover) */}
              <PanelLeftClose className="absolute h-4 w-4 text-accent opacity-0 scale-75 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              Collapse sidebar (⌘B)
            </TooltipContent>
          </Tooltip>

          {/* Integrated Brand Link + AI Badge Lockup */}
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className="flex min-w-0 items-center gap-1.5 group transition-opacity hover:opacity-85"
          >
            <span className="truncate text-[15px] font-semibold tracking-tight text-text-primary">
              Sync<span className="text-accent">Router</span>
            </span>
            <span className="rounded-[4px] border border-border bg-surface-hover px-1 py-0.2 font-mono text-[9px] font-medium tracking-wide text-text-muted">
              AI
            </span>
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex w-full flex-col items-center">
          {/* Logo Toggle Button in Collapsed Mode - 40x40px consistent badge */}
          <Tooltip>
            <TooltipTrigger
              render={<button />}
              onClick={toggleSidebar}
              className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-surface-hover shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:bg-surface-hover hover:border-accent active:scale-95"
              aria-label="Expand sidebar"
            >
              {/* Default SyncRouter Logo Icon (hidden on hover) */}
              <SyncRouterIcon size={20} className="transition-all duration-200 group-hover:scale-75 group-hover:opacity-0" />
              {/* Toggle Icon (revealed on hover) */}
              <PanelLeftOpen className="absolute h-4 w-4 text-accent opacity-0 scale-75 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              Expand sidebar (⌘B)
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 px-2.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(`${href}/`));

          if (isExpanded) {
            return (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 text-[14px] font-medium transition-colors border-l-2 rounded-r-[8px]",
                  isActive
                    ? "border-accent bg-surface-hover text-text-primary"
                    : "border-transparent text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-text-muted group-hover:text-text-secondary"
                  )}
                />
                <span className="truncate">{label}</span>
              </Link>
            );
          }

          return (
            <Tooltip key={href}>
              <TooltipTrigger
                render={<Link href={href} onClick={handleNavClick} />}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border-l-2 transition-colors rounded-r-[8px]",
                  isActive
                    ? "border-accent bg-surface-hover text-accent"
                    : "border-transparent text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                {label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* User + footer actions */}
      <div className="mt-auto flex flex-col gap-2 border-t border-border-subtle px-2.5 pt-3">
        {isExpanded ? (
          <>
            {/* Credits */}
            {user && (
              <div className="flex items-center justify-between rounded-[10px] border border-border bg-surface px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="text-xs font-medium text-text-secondary">Credits</span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {user.credits != null ? user.credits.toLocaleString() : "0"}
                </span>
              </div>
            )}

            {/* User Profile Card */}
            <div className="flex items-center justify-between rounded-[12px] border border-border bg-surface p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative shrink-0">
                  {user?.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.picture}
                      alt={user.name ?? user.email ?? "Avatar"}
                      className="h-7 w-7 rounded-[8px] border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-border bg-surface-hover font-medium text-text-secondary text-xs">
                      {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  {!user?.is_active && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface bg-danger" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium text-text-primary">
                    {user?.name ?? "Account"}
                  </span>
                  <span className="truncate text-[11px] text-text-muted">
                    {user?.email ?? ""}
                  </span>
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger
                  render={<button />}
                  onClick={handleLogout}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-text-muted transition-colors hover:bg-danger-bg hover:text-danger cursor-pointer"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  Sign out
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Credits Collapsed */}
            {user && (
              <Tooltip>
                <TooltipTrigger
                  render={<div />}
                  className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-surface-hover text-accent cursor-default shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                >
                  <CreditCard className="h-4 w-4 text-accent" />
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {user.credits != null ? `${user.credits.toLocaleString()} credits` : "0 credits"}
                </TooltipContent>
              </Tooltip>
            )}

            {/* User avatar */}
            <Tooltip>
              <TooltipTrigger
                className="relative h-10 w-10 cursor-pointer"
                render={<span />}
              >
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.picture}
                    alt={user.name ?? user.email ?? "Avatar"}
                    className="h-10 w-10 rounded-[8px] border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-surface-hover font-medium text-text-secondary">
                    {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
                  </div>
                )}
                {!user?.is_active && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-bg bg-danger" />
                )}
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                {user?.name ?? user?.email}
              </TooltipContent>
            </Tooltip>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger
                render={<button />}
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] text-text-muted transition-colors hover:bg-danger-bg hover:text-danger cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </aside>
  );
}