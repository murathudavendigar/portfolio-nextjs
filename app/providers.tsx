"use client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
