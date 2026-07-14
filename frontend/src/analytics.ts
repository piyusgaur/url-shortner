export interface LinkAnalyticsSummary {
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  error?: string;
}

export async function fetchLinkAnalytics(apiBaseUrl: string, code: string): Promise<LinkAnalyticsSummary> {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/analytics/${encodeURIComponent(code)}`);
  const body = (await response.json().catch(() => ({}))) as LinkAnalyticsSummary & ErrorResponse;

  if (!response.ok) {
    throw new Error(body.error ?? "Failed to load analytics");
  }

  return body;
}
