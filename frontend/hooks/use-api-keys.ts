"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiKey,
  ApiKeyCreate,
  ApiKeyCreateResponse,
  ApiKeyUpdate,
} from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

export function useApiKeys() {
  const { isAuthenticated } = useAuth();
  return useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: () => api.get<ApiKey[]>("/api-keys"),
    enabled: isAuthenticated,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ApiKeyCreate) =>
      api.post<ApiKeyCreateResponse>("/api-keys", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ApiKeyUpdate }) =>
      api.patch<ApiKey>(`/api-keys/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ message: string }>(`/api-keys/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}