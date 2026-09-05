import Link from "next/link";
import { SyncRouterLogo } from "@/components/shared/sync-router-logo";
import { AuthActions } from "./auth-actions";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#providers", label: "Providers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          aria-label="SyncRouter home"
          className="rounded-[8px] transition-opacity hover:opacity-85"
        >
          <SyncRouterLogo size="md" showBadge={false} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Landing navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[8px] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <AuthActions />
      </div>
    </header>
  );
}