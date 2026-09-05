"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { useModels } from "@/hooks/use-models";
import { useModelProviders } from "@/hooks/use-model-providers";
import LoadingSpinner from "@/components/shared/loading-spinner";
import ErrorState from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BrandLogo, ModelLogo, ProviderLogo } from "@/components/shared/brand-logos";

export default function ModelDetailPage() {
  const params = useParams<{ modelId: string }>();
  const router = useRouter();
  const modelId = params.modelId;

  const { data: models, isLoading: modelsLoading, isError: modelsError } = useModels();
  const {
    data: providers,
    isLoading: providersLoading,
    isError: providersError,
  } = useModelProviders(modelId);

  const model = models?.find((m) => m.id === modelId);

  if (modelsLoading) return <LoadingSpinner label="Loading model…" />;
  if (modelsError || !model)
    return <ErrorState onRetry={() => router.replace("/dashboard/models")} />;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2 text-text-muted hover:text-text-primary"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to models
      </Button>

      {/* Model Overview Header Card */}
      <div className="rounded-[12px] border border-border bg-surface p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
            <ModelLogo model={model} size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {model.name}
            </h1>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant="secondary" className="inline-flex items-center gap-1.5 rounded-[8px] text-xs font-medium">
                <BrandLogo name={model.company.name} size={13} />
                {model.company.name}
              </Badge>
              <code className="rounded-[8px] border border-border bg-surface-hover px-2 py-0.5 font-mono text-xs text-text-secondary">
                {model.slug}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Pricing Comparison */}
      <div>
        <div className="mb-4">
          <h2 className="text-[14px] font-medium uppercase tracking-wider text-text-muted">
            Provider pricing{" "}
            <span className="text-[13px] font-normal normal-case text-text-muted">
              (per 1M tokens)
            </span>
          </h2>
        </div>

        {providersLoading ? (
          <LoadingSpinner label="Loading provider pricing…" />
        ) : providersError ? (
          <ErrorState />
        ) : !providers || providers.length === 0 ? (
          <div className="flex min-h-[20vh] items-center justify-center rounded-[12px] border border-dashed border-border bg-surface/50 p-8">
            <p className="text-sm text-text-muted">No providers offer this model yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[12px] border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-surface border-b border-border">
                  <TableHead className="w-1/3 text-[14px] font-medium text-text-secondary">Provider</TableHead>
                  <TableHead className="text-right text-[14px] font-medium text-text-secondary">Input (per 1M)</TableHead>
                  <TableHead className="text-right text-[14px] font-medium text-text-secondary">Output (per 1M)</TableHead>
                  <TableHead className="text-right text-[14px] font-medium text-text-secondary">Combined heuristic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => {
                  const combined =
                    provider.input_token_cost * 0.5 + provider.output_token_cost * 0.5;
                  const isCheapest = providers.every(
                    (p) =>
                      p.input_token_cost * 0.5 + p.output_token_cost * 0.5 >= combined
                  );
                  return (
                    <TableRow
                      key={provider.id}
                      className={cn(
                        "border-b border-border-subtle bg-surface transition-colors hover:bg-surface-hover",
                        isCheapest && "bg-surface-hover/30"
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5 font-normal text-[14px] text-text-primary">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border border-border bg-surface-hover">
                            <ProviderLogo provider={provider} size={14} />
                          </div>
                          <a
                            href={provider.website ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition-colors font-medium"
                          >
                            {provider.name}
                          </a>
                          {provider.website && (
                            <Globe className="h-3.5 w-3.5 text-text-muted" />
                          )}
                          {isCheapest && (
                            <Badge
                              variant="success"
                              className="rounded-[8px] border border-success/30 bg-success-bg text-success text-[11px]"
                            >
                              Best value
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-[14px] text-text-primary">
                        ${provider.input_token_cost.toFixed(2)}
                        <span className="text-[12px] text-text-muted"> / 1M</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-[14px] text-text-primary">
                        ${provider.output_token_cost.toFixed(2)}
                        <span className="text-[12px] text-text-muted"> / 1M</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-[14px] text-accent">
                        ${combined.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}