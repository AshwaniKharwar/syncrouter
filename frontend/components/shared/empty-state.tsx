import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[12px] border border-dashed border-border bg-surface/50 p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
        compact ? "min-h-[24vh]" : "min-h-[35vh]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-[8px] border border-border bg-surface-hover",
          compact ? "h-9 w-9" : "h-11 w-11"
        )}
      >
        <Inbox className="h-5 w-5 text-text-muted" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        {description && (
          <p className="mt-1 max-w-sm text-[13px] text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}