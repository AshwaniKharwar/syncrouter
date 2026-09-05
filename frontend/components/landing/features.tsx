import {
  Gauge,
  KeyRound,
  Layers,
  LineChart,
  Route,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Route,
    title: "Smart model routing",
    description:
      "Dispatch every request to the model that best fits the task, budget, and latency budget — automatically.",
  },
  {
    icon: LineChart,
    title: "Real-time pricing",
    description:
      "Compare input and output token costs across every provider, down to six decimal places, always up to date.",
  },
  {
    icon: Gauge,
    title: "Latency insights",
    description:
      "See response-time guidance per model so you can ship snappy products without guessing which provider is fast.",
  },
  {
    icon: KeyRound,
    title: "Central API keys",
    description:
      "Manage every provider key from one secure place. Rotate, revoke, and keep secrets out of your codebase.",
  },
  {
    icon: Sparkles,
    title: "Unified model catalog",
    description:
      "Browse models across providers with names, slugs, and metadata in a single consistent catalog.",
  },
  {
    icon: Layers,
    title: "No lock-in",
    description:
      "Swap models or providers without touching your integration. One gateway, every model, zero rewrites.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-border-subtle bg-bg py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-accent">
            Everything in one gateway
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Built for teams that ship on AI
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
            Stop stitching together provider dashboards. SyncRouter gives your
            routing, cost intelligence, and key management a single home.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-[12px] border border-border bg-surface p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all hover:border-border hover:bg-surface-hover/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-surface-hover transition-colors group-hover:border-accent/30">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-text-primary">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}