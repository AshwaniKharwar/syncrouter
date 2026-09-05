import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncRouterMark } from "@/components/shared/sync-router-logo";

export function CtaBanner() {
  return (
    <section className="border-t border-border-subtle bg-bg py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[16px] border border-border bg-surface px-6 py-14 text-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:px-12">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute -top-24 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-border bg-surface-hover shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <SyncRouterMark size={22} />
            </div>
            <h2 className="mx-auto mt-6 max-w-xl text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              Start shipping on the{" "}
              <span className="bg-gradient-to-r from-[#FBBF24] via-accent to-[#D97706] bg-clip-text text-transparent">
                right model
              </span>{" "}
              today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary">
              Connect your providers, browse the catalog, and let SyncRouter
              route every request to its optimal model.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                render={<Link href="/login" />}
                size="lg"
                className="h-11 px-6 text-[15px]"
              >
                Get started free
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="/dashboard/models" />}
                size="lg"
                variant="outline"
                className="h-11 px-6 text-[15px]"
              >
                Explore the model catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}