"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateApiKey } from "@/hooks/use-api-keys";
import { cn } from "@/lib/utils";

interface CreateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateKeyDialog({ open, onOpenChange }: CreateKeyDialogProps) {
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const createKey = useCreateApiKey();

  const reset = () => {
    setName("");
    setCreatedKey(null);
    setCopied(false);
    createKey.reset();
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) reset();
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const result = await createKey.mutateAsync({ name: trimmed });
      setCreatedKey(result.api_key);
    } catch {
      // error handled via state below
    }
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-accent" />
            {createdKey ? "Key created" : "Create API key"}
          </DialogTitle>
          <DialogDescription>
            {createdKey
              ? "Copy this key now — you won't be able to see it again."
              : "Name your API key to identify it later."}
          </DialogDescription>
        </DialogHeader>

        {createdKey ? (
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-2 rounded-[8px] border border-border bg-surface-hover p-3 min-w-0">
              <code className="min-w-0 flex-1 truncate font-mono text-xs sm:text-sm text-text-primary select-all">
                {createdKey}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                className={cn(
                  "shrink-0 text-text-muted hover:text-text-primary hover:bg-surface",
                  copied && "text-success hover:text-success"
                )}
                aria-label={copied ? "Key copied" : "Copy key to clipboard"}
                title={copied ? "Copied" : "Copy to clipboard"}
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[13px] text-text-muted">
              Store this key securely. It grants access to your SyncRouter account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name" className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Key name
              </Label>
              <Input
                id="key-name"
                placeholder="e.g. Production, Staging, CLI…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                maxLength={255}
              />
            </div>
            {createKey.isError && (
              <p className="text-sm text-danger">
                {(createKey.error as Error).message}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {createdKey ? (
            <Button onClick={() => handleClose(false)} className="w-full">
              Done
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!name.trim() || createKey.isPending}
              >
                {createKey.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create key
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}