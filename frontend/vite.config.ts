import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const pkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./package.json", import.meta.url)),
    "utf-8",
  ),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(
      [
        "/transactions",
        "/dashboard/summary",
        "/dashboard/evolution",
        "/dashboard/categories",
        "/dashboard/projects",
      ].map((path) => [path, { target: "http://localhost:8080", changeOrigin: true }]),
    ),
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name),
  },
});
