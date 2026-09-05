import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { Providers } from "./providers";
import { CtaBanner } from "./cta-banner";
import { SiteFooter } from "./site-footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Providers />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}