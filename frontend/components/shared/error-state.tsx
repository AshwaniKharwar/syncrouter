"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 rounded-[12px] border border-danger/30 bg-danger-bg/40 p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-danger/30 bg-danger-bg">
        <AlertTriangle className="h-5 w-5 text-danger" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-text-primary">Something went wrong</h3>
        {message && (
          <p className="mt-1 max-w-sm text-[13px] text-text-muted">{message}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="text-text-primary">
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}