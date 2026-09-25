# Soroban Pulse — Web UI

React + TypeScript single-page app for exploring indexed events, monitoring
system health and operating the indexer.

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173, proxies API calls to http://localhost:3000
```

Set `VITE_API_PROXY` to proxy to a different server in development, or
`VITE_API_BASE_URL` at build time to call a remote API directly (the server's
`ALLOWED_ORIGINS` must then include the UI origin). The base URL, API key and
admin key can also be changed at runtime from **Settings** (⚙); keys are stored
only in the browser's localStorage.

## Pages

| Route | Description |
| --- | --- |
| `/explorer` | Event list. Filters: `?ledger=`, `?search=` (full-text), `?contract_id=`, `?event_type=` |
| `/contracts/:id` | Contract summary and events |
| `/accounts/:id` | Events mentioning a G… / M… address (full-text search) |
| `/tx/:hash` | Events emitted by a transaction |
| `/status` | Health tiles, 24h history and SLO report. `?public=1` for the read-only public view |
| `/admin` | Indexer status, pause/resume, replay, gap backfill and audit log (admin key) |

## Global search

Press <kbd>/</kbd> or <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> anywhere. Input is classified in
[`src/lib/detect.ts`](src/lib/detect.ts):

| Input | Detected as | Goes to |
| --- | --- | --- |
| `C…` (56 chars, valid strkey checksum) | Contract | `/contracts/:id` |
| `G…` (56) / `M…` (69) | Account / muxed account | `/accounts/:id` |
| 64 hex chars (optional `0x`) | Transaction hash | `/tx/:hash` |
| Integer (≤ u32, `,`/`_` separators allowed) | Ledger | `/explorer?ledger=N` |
| Anything else | Free text | `/explorer?search=…` |

The detected destination is always the highlighted first option, so pasting an
ID and pressing Enter once navigates. Partial `C…` input autocompletes from
`/v1/contracts/search`. The last 8 searches are kept in localStorage.

## Theming

All colours are CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css),
with a light and a dark set. The theme follows `prefers-color-scheme` until
the user picks Light or Dark with the header toggle (persisted as `sp.theme`).
Charts, code blocks and the JSON tree use the `--color-chart-*` and
`--color-code-*` tokens.

`npm run lint:colors` fails if a hex, `rgb()`/`hsl()` or named colour appears
anywhere outside `tokens.css`.

## Server features the UI expects but degrades without

- **Replay progress** — `POST /v1/admin/replay` currently returns no job id. If
  it starts returning `job_id` (or `status_url`), the admin console polls it
  for `status` / `progress`; until then jobs show as "accepted".
- **Gap detection** — the gaps panel reads `GET /v1/admin/indexer/gaps`
  (`{ data: [{ from_ledger, to_ledger, reason? }] }`) and shows a notice when
  the endpoint is missing. "Backfill" submits replay jobs in 10,000-ledger chunks.
