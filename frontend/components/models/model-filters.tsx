"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logos";
import { cn } from "@/lib/utils";

interface ModelFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  company: string;
  onCompanyChange: (value: string) => void;
  companies: string[];
}

export default function ModelFilters({
  search,
  onSearchChange,
  company,
  onCompanyChange,
  companies,
}: ModelFiltersProps) {
  const hasFilters = search !== "" || company !== "all";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <Input
          type="text"
          placeholder="Search models or providers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-8 rounded-[8px] border-border bg-surface text-sm text-text-primary placeholder:text-text-muted"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onCompanyChange("all")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-xs font-medium transition-colors border cursor-pointer",
            company === "all"
              ? "bg-accent/15 border-accent/40 text-accent font-semibold"
              : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          )}
        >
          All
        </button>

        {companies.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCompanyChange(company === c ? "all" : c)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-xs font-medium transition-colors border cursor-pointer",
              company === c
                ? "bg-accent/15 border-accent/40 text-accent font-semibold"
                : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            <BrandLogo name={c} size={13} />
            {c}
          </button>
        ))}

        {hasFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              onSearchChange("");
              onCompanyChange("all");
            }}
            className="text-text-muted hover:text-text-primary ml-1"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}