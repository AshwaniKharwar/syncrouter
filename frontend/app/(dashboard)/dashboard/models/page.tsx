"use client";

import { useMemo, useState } from "react";
import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/models/model-card";
import ModelFilters from "@/components/models/model-filters";
import LoadingSpinner from "@/components/shared/loading-spinner";
import ErrorState from "@/components/shared/error-state";

export default function ModelsPage() {
  const { data: models, isLoading, isError, refetch } = useModels();
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");

  const companies = useMemo(
    () => Array.from(new Set((models ?? []).map((m) => m.company.name))).sort(),
    [models]
  );

  const filtered = useMemo(() => {
    if (!models) return [];
    const query = search.toLowerCase().trim();
    return models.filter((model) => {
      const matchesSearch =
        !query ||
        model.name.toLowerCase().includes(query) ||
        model.slug.toLowerCase().includes(query) ||
        model.company.name.toLowerCase().includes(query);
      const matchesCompany = company === "all" || model.company.name === company;
      return matchesSearch && matchesCompany;
    });
  }, [models, search, company]);

  if (isLoading) return <LoadingSpinner label="Loading models…" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Models
          </h1>
          <p className="mt-1 text-[13px] text-text-muted">
            {filtered.length} model{filtered.length === 1 ? "" : "s"} available across providers
          </p>
        </div>
      </div>

      <ModelFilters
        search={search}
        onSearchChange={setSearch}
        company={company}
        onCompanyChange={setCompany}
        companies={companies}
      />

      {filtered.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-[12px] border border-dashed border-border bg-surface/50 p-8">
          <p className="text-sm text-text-muted">
            No models found{search && ` for “${search}”`}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}