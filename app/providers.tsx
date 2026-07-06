"use client";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
      <ToastContainer />
    </ThemeProvider>
  );
}
