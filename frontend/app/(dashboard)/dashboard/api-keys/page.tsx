"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useApiKeys } from "@/hooks/use-api-keys";
import ApiKeyTable from "@/components/api-keys/api-key-table";
import CreateKeyDialog from "@/components/api-keys/create-key-dialog";
import LoadingSpinner from "@/components/shared/loading-spinner";
import ErrorState from "@/components/shared/error-state";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function ApiKeysPage() {
  const { data: keys, isLoading, isError, refetch } = useApiKeys();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) return <LoadingSpinner label="Loading API keys…" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            API Keys
          </h1>
          <p className="mt-1 text-[13px] text-text-muted">
            {keys?.length ?? 0} active key{keys?.length === 1 ? "" : "s"} available for routing
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create key
        </Button>
      </div>

      {!keys || keys.length === 0 ? (
        <EmptyState
          title="No API keys yet"
          description="Create your first API key to start routing requests through SyncRouter."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create your first key
            </Button>
          }
        />
      ) : (
        <ApiKeyTable keys={keys} />
      )}

      <CreateKeyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}