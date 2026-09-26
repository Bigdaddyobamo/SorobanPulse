import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Soroban Pulse API listens on :3000 by default. Proxy API paths in dev so
// the UI can run on its own port without CORS configuration.
const apiTarget = process.env.SOROBAN_PULSE_API ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/v1': apiTarget,
      '/health': apiTarget,
    },
  },
});
