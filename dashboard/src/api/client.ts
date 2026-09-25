export interface SystemStatus {
  status: "healthy" | "degraded" | "down";
  uptimeSeconds: number;
  version: string;
}

export interface MetricPoint {
  timestamp: string;
  eventsIngested: number;
  latencyMsP99: number;
}

export interface SubscriptionSummary {
  id: string;
  contractId: string;
  webhookUrl: string;
  eventTypes: string[];
  status: "active" | "paused" | "failing";
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  statusCode: number;
  attempt: number;
  deliveredAt: string;
}

export interface ApiErrorDetail {
  status: number;
  statusText: string;
  requestId: string | null;
  retryAfter: number | null;
  message: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly requestId: string | null;
  public readonly retryAfter: number | null;

  constructor(detail: ApiErrorDetail) {
    super(detail.message);
    this.name = "ApiError";
    this.status = detail.status;
    this.statusText = detail.statusText;
    this.requestId = detail.requestId;
    this.retryAfter = detail.retryAfter;
  }
}

function authHeaders(): Record<string, string> {
  const raw = localStorage.getItem("sorobanpulse.dashboard.auth");
  const token = raw ? JSON.parse(raw).token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`, { headers: authHeaders() });
  if (!response.ok) {
    const requestId = response.headers.get("x-request-id");
    const retryAfter = response.headers.get("retry-after");
    const retryAfterSec = retryAfter ? Number(retryAfter) : null;
    const body = await response.text();
    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      requestId,
      retryAfter: retryAfterSec,
      message: body || `request to ${path} failed: ${response.status}`,
    });
  }
  return response.json();
}

export const dashboardApi = {
  getSystemStatus: () => get<SystemStatus>("/status"),
  getMetrics: (rangeMinutes = 60) => get<MetricPoint[]>(`/metrics?range=${rangeMinutes}`),
  listSubscriptions: () => get<SubscriptionSummary[]>("/subscriptions"),
  listWebhookDeliveries: (subscriptionId: string) =>
    get<WebhookDelivery[]>(`/subscriptions/${subscriptionId}/deliveries`),
};
