import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: { alias: { "@": src } },
  css: { preprocessorOptions: { scss: { loadPaths: [path.join(src, "styles")] } } },
  test: { include: ["src/**/*.test.{ts,tsx}"] },
});
