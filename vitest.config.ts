import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Path alias required because schema.ts and other lib files use @/ runtime imports
    // (unlike blog.ts which only uses type-only imports from @/types)
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: { include: ["lib/__tests__/**/*.test.ts"] },
});
