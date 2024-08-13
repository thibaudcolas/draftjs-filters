/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/draftjs-filters/",
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    coverage: {
      provider: "v8",
      exclude: [
        "./*.{js,mjs,ts}",
        "build",
        "dist",
        "docs",
        "pasting",
        "src/vite-env.d.ts",
      ],
    },
  },
})
