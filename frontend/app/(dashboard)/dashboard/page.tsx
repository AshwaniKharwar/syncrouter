"use client";

import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  Network,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useModels, useProviders } from "@/hooks/use-models";
import { useApiKeys } from "@/hooks/use-api-keys";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/loading-spinner";
import EmptyState from "@/components/shared/empty-state";
import ModelCard from "@/components/models/model-card";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { data: providers } = useProviders();
  const { data: keys } = useApiKeys();

  const activeKeys = keys?.filter((k) => k.is_active).length ?? 0;

  const stats = [
    {
      label: "Models available",
      value: models?.length ?? 0,
      icon: Sparkles,
      href: "/dashboard/models",
    },
    {
      label: "Active providers",
      value: providers?.length ?? 0,
      icon: Network,
      href: "/dashboard/providers",
    },
    {
      label: "Active API keys",
      value: activeKeys,
      icon: KeyRound,
      href: "/dashboard/api-keys",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Primary Welcome Banner with distinct surface gradient */}
      <div className="relative overflow-hidden rounded-[12px] border border-border bg-gradient-to-br from-surface via-surface to-accent/[0.08] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed font-normal text-text-secondary">
            Your AI routing hub is active. Compare pricing across providers, explore the
            model catalog, and manage your API keys with unified latency and cost optimization.
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard/models"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              Explore model catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Grid (3 cards, reduced vertical padding by ~30%, tight alignment) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => {
          const content = (
            <Card className="group border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:bg-surface-hover/50 hover:border-border">
              <CardContent className="flex items-center gap-3.5 px-4.5 py-3.5">
                {/* Consistent 40x40px Icon Badge: neutral surface-hover background + 1px border + accent glyph */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[32px] font-bold leading-none tracking-tight text-text-primary">
                    {value}
                  </p>
                  <p className="mt-1 text-[13px] font-normal text-text-muted">{label}</p>
                </div>
              </CardContent>
            </Card>
          );
          return (
            <Link key={label} href={href} className="block">
              {content}
            </Link>
          );
        })}
      </div>

      {/* 3. Model Catalog Section (32px vertical separation from stats) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium uppercase tracking-wider text-text-muted">
            Model catalog
          </h2>
          <Link
            href="/dashboard/models"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-text-secondary transition-colors hover:text-accent"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {modelsLoading ? (
          <LoadingSpinner label="Loading models…" />
        ) : (
          <>
            {!models || models.length === 0 ? (
              <EmptyState
                compact
                title="No models available"
                description="Models will appear here once seeded."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {models.slice(0, 4).map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}