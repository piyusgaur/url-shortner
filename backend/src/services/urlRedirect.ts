import { ApiError } from "../errors/ApiError.js";
import { UrlMapping } from "../models/urlMapping.js";

export interface RedirectResult {
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  lastAccessedAt: Date;
}

export async function resolveShortCode(code: string): Promise<RedirectResult> {
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    throw new ApiError(400, "code is required");
  }

  const mapping = await UrlMapping.findOneAndUpdate(
    { shortCode: trimmedCode },
    {
      $inc: { clickCount: 1 },
      $set: { lastAccessedAt: new Date() },
    },
    {
      new: true,
    }
  ).lean();

  if (!mapping) {
    throw new ApiError(404, "Short code not found");
  }

  return {
    originalUrl: mapping.originalUrl,
    shortCode: mapping.shortCode,
    clickCount: mapping.clickCount,
    lastAccessedAt: mapping.lastAccessedAt ?? new Date(),
  };
}
