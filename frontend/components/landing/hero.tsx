import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Gauge,
  Route,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logos";
import {
  SyncRouterIcon,
  SyncRouterMark,
} from "@/components/shared/sync-router-logo";

const ROUTE_ROWS = [
  {
    prompt: "Summarize Q3 earnings transcript",
    model: "claude-5",
    company: "Anthropic",
    cost: "$6.00 / $27.00",
    latency: "4.2s",
    status: "optimal",
    statusTone: "optimal",
  },
  {
    prompt: "Draft follow-up email to lead",
    model: "gpt-5.6-luna",
    company: "OpenAI",
    cost: "$1.50 / $4.00",
    latency: "1.8s",
    status: "saved $0.41",
    statusTone: "cheapest",
  },
  {
    prompt: "Extract entities from support PDF",
    model: "gemini-3.6-flash",
    company: "Google",
    cost: "$1.10 / $2.40",
    latency: "0.9s",
    status: "lowest cost",
    statusTone: "optimal",
  },
];

const HERO_STATS = [
  { value: "22+", label: "models" },
  { value: "7", label: "providers" },
  { value: "6", label: "decimal cost precision" },
  { value: "<1min", label: "key setup" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-24 -right-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-16 md:px-6 md:pt-24 md:pb-20">
        {/* Hero copy */}
        <div className="animate-fade-in-up mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[12px] font-medium text-text-secondary">
              Unified AI model routing for every request
            </span>
          </div>

          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Route every AI request to the{" "}
            <span className="bg-gradient-to-r from-[#FBBF24] via-accent to-[#D97706] bg-clip-text text-transparent">
              optimal model
            </span>
            .
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary md:text-base">
            SyncRouter compares models across providers, tracks real-time pricing
            and latency, and manages your API keys in one place — so every call
            ships on the best model for the job.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              render={<Link href="/login" />}
              size="lg"
              className="h-11 px-6 text-[15px]"
            >
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/dashboard" />}
              size="lg"
              variant="outline"
              className="h-11 px-6 text-[15px]"
            >
              Open the dashboard
            </Button>
          </div>

          <p className="mt-4 text-[12px] text-text-muted">
            Sign in with Google · No credit card required
          </p>

          {/* Stats */}
          <div className="mt-10 flex w-full max-w-2xl items-center justify-center divide-x divide-border-subtle">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="flex-1 px-2">
                <p className="font-mono text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-[11px] tracking-wide text-text-muted sm:text-[12px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Routing console mock */}
        <div className="relative mx-auto mt-16 max-w-3xl animate-fade-in-up md:mt-20">
          {/* Floating accent chips (desktop) */}
          <div className="absolute -top-6 -left-10 z-10 hidden items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)] lg:flex">
            <Gauge className="h-4 w-4 text-accent" />
            <div>
              <p className="text-[12px] font-medium text-text-primary">Latency down</p>
              <p className="font-mono text-[11px] text-success">36% median</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-6 z-10 hidden items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)] lg:flex">
            <CircleCheck className="h-4 w-4 text-success" />
            <div>
              <p className="text-[12px] font-medium text-text-primary">Auto-routing</p>
              <p className="font-mono text-[11px] text-text-muted">always on</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-border bg-surface shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Console window bar */}
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg/40 px-4 py-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
              </div>
              <div className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-text-muted">
                <SyncRouterIcon size={14} />
                <span className="truncate">syncrouter route --auto</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                Routing live
              </div>
            </div>

            {/* Console body */}
            <div className="space-y-3 p-4 md:p-5">
              {ROUTE_ROWS.map((row) => (
                <div
                  key={row.prompt}
                  className="rounded-[12px] border border-border-subtle bg-bg/40 p-3.5 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
                        <BrandLogo name={row.company} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-text-primary">
                          {row.prompt}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-text-muted">
                          POST /v1/chat · {row.model}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-[12px] font-medium text-text-primary">
                        {row.cost}
                      </p>
                      <p className="text-[10px] tracking-wide text-text-muted">
                        in / out per 1M
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-border-subtle pt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-border-subtle bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      <Route className="h-3 w-3 text-accent" />
                      routed in {row.latency}
                    </span>
                    <span
                      className={
                        row.statusTone === "cheapest"
                          ? "inline-flex items-center gap-1.5 rounded-[6px] border border-success/30 bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success"
                          : "inline-flex items-center gap-1.5 rounded-[6px] border border-border-subtle bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary"
                      }
                    >
                      <SyncRouterMark size={10} />
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}