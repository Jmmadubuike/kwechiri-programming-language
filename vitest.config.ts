import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    environment: "node",
    fileParallelism: false,
    include: ["tests/**/*.test.ts"],
    testTimeout: 15_000,
  },
});
