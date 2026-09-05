"use client";

import { useQuery } from "@tanstack/react-query";
import type { ModelProvider } from "@/types/api";
import { api } from "@/lib/api";

export function useModelProviders(modelId: string) {
  return useQuery<ModelProvider[]>({
    queryKey: ["model-providers", modelId],
    queryFn: () => api.get<ModelProvider[]>(`/models/${modelId}/providers`),
    enabled: !!modelId,
  });
}