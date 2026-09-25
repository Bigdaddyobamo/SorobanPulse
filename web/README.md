# SorobanPulse web dashboard

Vanilla TypeScript + Vite. The backend serves the build at `/ui`. See [docs/dashboard.md](../docs/dashboard.md)
for configuration, caching and the Content-Security-Policy.

```bash
npm install
SOROBAN_PULSE_API=http://localhost:3000 npm run dev
npm run build   # → dist/
```

Styling comes only from the shared design system: `../design/build/tokens.css` and `../design/components.css`.
