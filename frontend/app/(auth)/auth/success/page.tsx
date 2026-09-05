"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { SyncRouterIcon, SyncRouterLogo } from "@/components/shared/sync-router-logo";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finish = async () => {
      await refreshUser();
      setLoading(false);
    };
    finish();
  }, [refreshUser]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  void searchParams;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <p className="text-[13px] text-text-muted">Signing you in…</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-8 flex items-center justify-center">
        <SyncRouterLogo size="lg" />
      </div>

      <div className="flex w-full max-w-md flex-col items-center rounded-[12px] border border-border bg-surface p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
          <SyncRouterIcon size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary">
          Welcome to SyncRouter
        </h1>
        <p className="mt-2 text-[13px] text-text-muted">Taking you to your dashboard…</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <Suspense
        fallback={
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        }
      >
        <AuthSuccessContent />
      </Suspense>
    </main>
  );
}