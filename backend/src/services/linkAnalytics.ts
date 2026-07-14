import { ApiError } from "../errors/ApiError.js";
import { UrlMapping } from "../models/urlMapping.js";

export interface LinkAnalyticsResult {
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getLinkAnalytics(code: string): Promise<LinkAnalyticsResult> {
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    throw new ApiError(400, "code is required");
  }

  const mapping = await UrlMapping.findOne({ shortCode: trimmedCode }).lean();

  if (!mapping) {
    throw new ApiError(404, "Short code not found");
  }

  return {
    originalUrl: mapping.originalUrl,
    shortCode: mapping.shortCode,
    clickCount: mapping.clickCount,
    lastAccessedAt: mapping.lastAccessedAt,
    createdAt: mapping.createdAt,
    updatedAt: mapping.updatedAt,
  };
}
