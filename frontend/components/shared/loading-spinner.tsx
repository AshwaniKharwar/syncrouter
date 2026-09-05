import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-accent" />
      <p className="text-[13px] text-text-muted">{label}</p>
    </div>
  );
}