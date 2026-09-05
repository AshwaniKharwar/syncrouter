"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Layers, Loader2, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOOGLE_LOGIN_URL } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import GoogleLogo from "@/components/auth/google-logo";
import { SyncRouterLogo } from "@/components/shared/sync-router-logo";

const FEATURES = [
  { icon: Layers, label: "Compare models across providers" },
  { icon: Route, label: "Route to the optimal provider" },
  { icon: KeyRound, label: "Manage your API keys securely" },
];

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    window.location.href = GOOGLE_LOGIN_URL;
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center gap-5">
          <SyncRouterLogo size="lg" />
          <div className="flex items-center gap-2 text-[13px] text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Checking your session…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <main className="relative flex w-full max-w-md flex-col items-center">
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-center">
          <SyncRouterLogo size="lg" />
        </div>

        {/* Card */}
        <div className="w-full rounded-[12px] border border-border bg-surface p-7 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="mt-1.5 text-center text-[13px] text-text-muted">
            Sign in to manage your AI model routing and API keys
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-[10px] border border-border-subtle bg-surface-hover/40 px-3.5 py-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-hover">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-[13px] text-text-secondary">{label}</span>
              </div>
            ))}

            <Button
              onClick={handleGoogleLogin}
              disabled={isRedirecting}
              className="mt-3 h-10 w-full gap-2.5 rounded-[8px] text-sm font-medium"
              size="lg"
              variant="outline"
            >
              {isRedirecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleLogo />
              )}
              {isRedirecting ? "Redirecting to Google…" : "Continue with Google"}
              {!isRedirecting && <ArrowRight className="h-4 w-4 text-text-muted" />}
            </Button>

            <p className="mt-2 text-center text-[12px] text-text-muted">
              By continuing, you agree to SyncRouter&apos;s Terms of Service.
            </p>
          </div>
        </div>

        <p className="mt-6 text-[12px] text-text-muted">
          © {new Date().getFullYear()} SyncRouter. All rights reserved.
        </p>
      </main>
    </div>
  );
}