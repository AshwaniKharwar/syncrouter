"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export function AuthActions() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-7 w-16 animate-pulse rounded-[8px] bg-surface-hover" />
        <div className="h-7 w-28 animate-pulse rounded-[8px] bg-surface-hover" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Button render={<Link href="/dashboard" />} size="sm">
        <LayoutDashboard className="size-4" />
        Open dashboard
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button render={<Link href="/login" />} variant="ghost" size="sm">
        Log in
      </Button>
      <Button render={<Link href="/login" />} size="sm">
        Get started
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  );
}