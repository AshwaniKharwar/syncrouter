"use client";

import { Globe } from "lucide-react";
import { useProviders } from "@/hooks/use-models";
import LoadingSpinner from "@/components/shared/loading-spinner";
import ErrorState from "@/components/shared/error-state";
import { ProviderLogo } from "@/components/shared/brand-logos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProvidersPage() {
  const { data: providers, isLoading, isError, refetch } = useProviders();

  if (isLoading) return <LoadingSpinner label="Loading providers…" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Providers
        </h1>
        <p className="mt-1 text-[13px] text-text-muted">
          {providers?.length ?? 0} AI inference providers configured for dynamic routing
        </p>
      </div>

      {!providers || providers.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-[12px] border border-dashed border-border bg-surface/50 p-8">
          <p className="text-sm text-text-muted">No providers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className="group border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:bg-surface-hover/50 hover:border-border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
                    <ProviderLogo provider={provider} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-[15px] font-medium text-text-primary">
                      {provider.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {provider.website ? (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {provider.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        <span className="text-[13px] text-text-muted">
                          No website listed
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 pt-0">
                {["Model routing", "Token pricing", "Unified API"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[8px] border border-border bg-surface-hover px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}