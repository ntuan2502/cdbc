// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </HeroUIProvider>
  );
}
