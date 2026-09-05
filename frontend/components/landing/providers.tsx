import { BrandLogo } from "@/components/shared/brand-logos";

const PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Azure",
  "Vertex",
  "DeepSeek",
  "Kimi",
  "Groq",
  "Mistral",
];

export function Providers() {
  return (
    <section
      id="providers"
      className="border-t border-border-subtle bg-bg py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.16em] text-text-muted">
          Works with the providers you already use
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-10">
          {PROVIDERS.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 text-text-muted transition-colors hover:text-text-secondary"
            >
              <BrandLogo name={name} size={18} className="opacity-80 grayscale-[35%] hover:opacity-100 hover:grayscale-0" />
              <span className="text-[13px] font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}