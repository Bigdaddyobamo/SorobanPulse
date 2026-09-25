import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, API calls are proxied to the Rust server so the UI can use
// same-origin relative URLs. Override the target with VITE_API_PROXY.
const target = process.env.VITE_API_PROXY ?? "http://localhost:3000";
const proxied = ["/v1", "/health", "/healthz", "/status"];

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: Object.fromEntries(proxied.map((p) => [p, { target, changeOrigin: true }])),
  },
});
