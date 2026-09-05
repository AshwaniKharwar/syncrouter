"use client";

import { useQuery } from "@tanstack/react-query";
import type { AIModel, Provider } from "@/types/api";
import { api } from "@/lib/api";

export function useModels() {
  return useQuery<AIModel[]>({
    queryKey: ["models"],
    queryFn: () => api.get<AIModel[]>("/models"),
  });
}

export function useProviders() {
  return useQuery<Provider[]>({
    queryKey: ["providers"],
    queryFn: () => api.get<Provider[]>("/models/providers"),
  });
}