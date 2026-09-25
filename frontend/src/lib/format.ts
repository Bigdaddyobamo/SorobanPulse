export function shortId(id: string, head = 6, tail = 6): string {
  return id.length <= head + tail + 1 ? id : `${id.slice(0, head)}…${id.slice(-tail)}`;
}

export function formatNumber(n: number | null | undefined): string {
  return n === null || n === undefined || Number.isNaN(n) ? "—" : n.toLocaleString();
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export function formatDuration(secs: number): string {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m`;
  return `${Math.floor(secs)}s`;
}

export function formatPercent(ratio: number, digits = 2): string {
  return Number.isFinite(ratio) ? `${(ratio * 100).toFixed(digits)}%` : "—";
}
