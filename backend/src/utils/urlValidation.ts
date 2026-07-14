import { ApiError } from "../errors/ApiError.js";

const SHORT_CODE_PATTERN = /^[A-Za-z0-9_-]{3,64}$/;

export function normalizeUrl(input: string): string {
  if (typeof input !== "string") {
    throw new ApiError(400, "URL must be a string");
  }

  const trimmed = input.trim();

  if (!trimmed) {
    throw new ApiError(400, "URL is required");
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    throw new ApiError(400, "URL must be valid");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ApiError(400, "URL must start with http:// or https://");
  }

  return parsed.toString();
}

export function normalizeShortCode(input: string | undefined): string | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input !== "string") {
    throw new ApiError(400, "Alias must be a string");
  }

  const trimmed = input.trim();

  if (!trimmed) {
    throw new ApiError(400, "Alias cannot be empty");
  }

  if (!SHORT_CODE_PATTERN.test(trimmed)) {
    throw new ApiError(400, "Alias must be 3-64 characters using letters, numbers, underscore, or dash");
  }

  return trimmed;
}
