"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncRouterLogo } from "@/components/shared/sync-router-logo";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "Authentication failed.";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-8 flex items-center justify-center">
        <SyncRouterLogo size="lg" />
      </div>

      <div className="w-full max-w-md rounded-[12px] border border-border bg-surface p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] border border-danger/30 bg-danger-bg">
          <AlertCircle className="h-6 w-6 text-danger" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary">
          Could not sign in
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{message}</p>
        <Link href="/login" className="mt-6 block w-full">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to login
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <Suspense
        fallback={
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        }
      >
        <AuthErrorContent />
      </Suspense>
    </main>
  );
}