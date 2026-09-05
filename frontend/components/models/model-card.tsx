"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AIModel } from "@/types/api";
import { BrandLogo, ModelLogo } from "@/components/shared/brand-logos";
import { getModelMetadata } from "@/lib/model-metadata";

interface ModelCardProps {
  model: AIModel;
}

export default function ModelCard({ model }: ModelCardProps) {
  const meta = getModelMetadata(model.slug, model.company.name);

  return (
    <Link
      href={`/dashboard/models/${model.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border border-border bg-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:bg-surface-hover/80 hover:border-border"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
            <ModelLogo model={model} size={20} />
          </div>
          <ArrowUpRight className="h-4 w-4 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="mt-2.5">
          <h3 className="truncate text-[14px] font-medium tracking-tight text-text-primary">
            {model.name}
          </h3>
          <p className="mt-0.5 truncate font-mono text-xs text-text-muted">{model.slug}</p>
        </div>
      </div>

      <div className="mt-3.5 space-y-2 border-t border-border-subtle pt-2.5">
        <div className="flex items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-border-subtle bg-surface-hover/70 px-2 py-0.5 text-[11px] font-normal text-text-secondary">
            <BrandLogo name={model.company.name} size={11} />
            {model.company.name}
          </span>
          <span className="rounded-[4px] border border-border-subtle bg-surface-hover/40 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            {meta.contextWindow}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-muted">
          <span>{meta.latencyTag}</span>
          <span className="font-mono text-text-secondary">{meta.pricePerMillion}</span>
        </div>
      </div>
    </Link>
  );
}