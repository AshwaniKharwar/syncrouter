"use client";

import { useState } from "react";
import {
  KeyRound,
  Lock,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import type { ApiKey } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteApiKey, useUpdateApiKey } from "@/hooks/use-api-keys";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function KeyName({ apiKey }: { apiKey: ApiKey }) {
  return (
    <div className="flex items-center gap-1.5">
      <code className="rounded-[8px] border border-border bg-surface-hover px-2 py-0.5 font-mono text-xs text-text-secondary">
        {apiKey.api_key}
      </code>
      <Lock
        className="h-3 w-3 shrink-0 text-text-muted"
        aria-label="Full key is shown only once at creation"
      />
    </div>
  );
}

export default function ApiKeyTable({ keys }: { keys: ApiKey[] }) {
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);
  const [renameTarget, setRenameTarget] = useState<ApiKey | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const deleteKey = useDeleteApiKey();
  const updateKey = useUpdateApiKey();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteKey.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleRename = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    await updateKey.mutateAsync({
      id: renameTarget.id,
      body: { name: renameValue.trim() },
    });
    setRenameTarget(null);
    setRenameValue("");
  };

  const handleToggle = (key: ApiKey) => {
    updateKey.mutateAsync({ id: key.id, body: { is_active: !key.is_active } });
  };

  return (
    <>
      <div className="overflow-hidden rounded-[12px] border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-surface border-b border-border">
              <TableHead className="text-[14px] font-medium text-text-secondary">Name</TableHead>
              <TableHead className="text-[14px] font-medium text-text-secondary">Key</TableHead>
              <TableHead className="text-[14px] font-medium text-text-secondary">Status</TableHead>
              <TableHead className="text-[14px] font-medium text-text-secondary">Created</TableHead>
              <TableHead className="text-[14px] font-medium text-text-secondary">Last updated</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow
                key={key.id}
                className="border-b border-border-subtle bg-surface transition-colors hover:bg-surface-hover"
              >
                <TableCell>
                  <div className="flex items-center gap-2 font-normal text-[14px] text-text-primary">
                    <KeyRound className="h-3.5 w-3.5 text-text-muted" />
                    <span>{key.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <KeyName apiKey={key} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={key.is_active ? "success" : "secondary"}
                    className={cn(
                      "gap-1.5 rounded-[8px] px-2 py-0.5 text-xs font-medium",
                      key.is_active
                        ? "border border-success/30 bg-success-bg text-success"
                        : "border border-border bg-surface-hover text-text-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        key.is_active ? "bg-success" : "bg-text-muted"
                      )}
                    />
                    {key.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-[13px] text-text-muted">
                  {formatDate(key.created_at)}
                </TableCell>
                <TableCell className="text-[13px] text-text-muted">
                  {formatDate(key.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-[8px] text-text-muted hover:bg-surface-hover hover:text-text-primary"
                          aria-label={`Actions for ${key.name}`}
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameTarget(key);
                          setRenameValue(key.name);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4 text-text-muted" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggle(key)}>
                        <Power className="mr-2 h-4 w-4 text-text-muted" />
                        {key.is_active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteTarget(key)}
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename key</DialogTitle>
            <DialogDescription>
              Update the name for{" "}
              <span className="font-mono text-xs text-text-secondary">{renameTarget?.api_key}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-input" className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Key name
            </Label>
            <Input
              id="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              maxLength={255}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!renameValue.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete API key?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-text-primary">
                {deleteTarget?.name}
              </span>{" "}
              will be permanently revoked. Requests using this key will stop working
              immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteKey.isPending}
            >
              {deleteKey.isPending ? "Deleting…" : "Delete key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}