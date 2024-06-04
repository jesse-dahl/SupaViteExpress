import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ["./component/*"],
    environment: "jsdom",
    setupFiles: "./vitest/setup.ts"
  },
});