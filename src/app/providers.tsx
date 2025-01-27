// app/providers.tsx
"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        {children}
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </HeroUIProvider>
  );
}
