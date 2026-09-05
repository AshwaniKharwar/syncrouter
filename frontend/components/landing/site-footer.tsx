import Link from "next/link";
import { SyncRouterLogo } from "@/components/shared/sync-router-logo";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#providers", label: "Providers" },
      { href: "/dashboard/models", label: "Model catalog" },
    ],
  },
  {
    heading: "Getting started",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/login", label: "Sign up free" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <SyncRouterLogo size="md" showBadge={false} />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-text-muted">
              The unified gateway for AI model routing, pricing intelligence,
              and API key management.
            </p>
          </div>

          {FOOTER_COLUMNS.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-text-secondary transition-colors hover:text-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-6 sm:flex-row">
          <p className="text-[12px] text-text-muted">
            © {new Date().getFullYear()} SyncRouter. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-text-muted">
            syncrouter · ai model routing platform
          </p>
        </div>
      </div>
    </footer>
  );
}