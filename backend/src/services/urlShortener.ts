import { randomBytes } from "crypto";
import { ApiError } from "../errors/ApiError.js";
import { UrlMapping } from "../models/urlMapping.js";
import { normalizeShortCode, normalizeUrl } from "../utils/urlValidation.js";

const MAX_GENERATION_ATTEMPTS = 12;
const GENERATED_CODE_BYTES = 6;

export interface ShortenInput {
  url: string;
  alias?: string;
}

export interface ShortenResult {
  originalUrl: string;
  shortCode: string;
  created: boolean;
}

export async function shortenUrl(input: ShortenInput): Promise<ShortenResult> {
  const originalUrl = normalizeUrl(input.url);
  const alias = normalizeShortCode(input.alias);

  const existing = await UrlMapping.findOne({ originalUrl }).lean();

  if (existing) {
    if (alias && existing.shortCode !== alias) {
      throw new ApiError(409, "This URL already has a different short code");
    }

    return {
      originalUrl: existing.originalUrl,
      shortCode: existing.shortCode,
      created: false,
    };
  }

  const shortCode = alias ?? (await generateUniqueShortCode());

  try {
    const created = await UrlMapping.create({
      originalUrl,
      shortCode,
    });

    return {
      originalUrl: created.originalUrl,
      shortCode: created.shortCode,
      created: true,
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, "Short code already exists");
    }

    throw error;
  }
}

async function generateUniqueShortCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const candidate = randomBytes(GENERATED_CODE_BYTES).toString("base64url");
    const exists = await UrlMapping.exists({ shortCode: candidate });

    if (!exists) {
      return candidate;
    }
  }

  throw new ApiError(500, "Unable to generate a unique short code");
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}
