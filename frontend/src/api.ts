export interface ShortenRequest {
  apiBaseUrl: string;
  url: string;
  alias?: string;
}

export interface ShortenResponse {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  created: boolean;
}

interface ErrorResponse {
  error?: string;
}

export async function shortenUrl(input: ShortenRequest): Promise<ShortenResponse> {
  const response = await fetch(`${input.apiBaseUrl.replace(/\/$/, "")}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: input.url,
      alias: input.alias,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as ShortenResponse & ErrorResponse;

  if (!response.ok) {
    throw new Error(body.error ?? "Failed to shorten URL");
  }

  return body;
}
