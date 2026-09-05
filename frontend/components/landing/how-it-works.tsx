import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logos";

const STEPS = [
  {
    step: "01",
    title: "Connect providers",
    description:
      "Add your OpenAI, Anthropic, Google, and other API keys once. SyncRouter handles the rest.",
    logos: ["OpenAI", "Anthropic", "Google"],
  },
  {
    step: "02",
    title: "Compare the catalog",
    description:
      "Browse every model across providers with clean pricing and latency signals side by side.",
    logos: ["DeepSeek", "Azure", "Vertex"],
  },
  {
    step: "03",
    title: "Route and ship",
    description:
      "Send requests through one gateway and let SyncRouter pick the optimal model per call.",
    logos: ["Kimi", "Groq", "Mistral"],
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-border-subtle bg-surface/30 py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Live in three steps
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
            From zero to routed in minutes — no infrastructure to babysit.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map(({ step, title, description, logos }, idx) => (
            <div
              key={step}
              className="relative rounded-[12px] border border-border bg-bg/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] font-semibold text-accent">
                  {step}
                </span>
                {idx < STEPS.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-text-muted md:block" />
                )}
              </div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-text-primary">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                {description}
              </p>
              <div className="mt-5 flex items-center gap-2">
                {logos.map((name) => (
                  <div
                    key={name}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border-subtle bg-surface"
                  >
                    <BrandLogo name={name} size={16} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Start routing now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}