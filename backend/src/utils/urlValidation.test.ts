import { ApiError } from "../errors/ApiError.js";
import { normalizeShortCode, normalizeUrl } from "./urlValidation.js";

describe("urlValidation", () => {
  describe("normalizeUrl", () => {
    it("trims and normalizes a valid http url", () => {
      expect(normalizeUrl("  http://example.com/path  ")).toBe("http://example.com/path");
    });

    it("rejects non-string input", () => {
      expect(() => normalizeUrl((123 as unknown) as string)).toThrow(ApiError);
      expect(() => normalizeUrl((123 as unknown) as string)).toThrow("URL must be a string");
    });

    it("rejects empty input", () => {
      expect(() => normalizeUrl("   ")).toThrow("URL is required");
    });

    it("rejects unsupported protocols", () => {
      expect(() => normalizeUrl("ftp://example.com")).toThrow("URL must start with http:// or https://");
    });

    it("rejects malformed urls", () => {
      expect(() => normalizeUrl("not-a-url")).toThrow("URL must be valid");
    });
  });

  describe("normalizeShortCode", () => {
    it("returns undefined for missing aliases", () => {
      expect(normalizeShortCode(undefined)).toBeUndefined();
    });

    it("trims a valid alias", () => {
      expect(normalizeShortCode("  launch-day  ")).toBe("launch-day");
    });

    it("rejects non-string aliases", () => {
      expect(() => normalizeShortCode((123 as unknown) as string)).toThrow("Alias must be a string");
    });

    it("rejects empty aliases", () => {
      expect(() => normalizeShortCode("   ")).toThrow("Alias cannot be empty");
    });

    it("rejects aliases with invalid characters", () => {
      expect(() => normalizeShortCode("bad alias")).toThrow(
        "Alias must be 3-64 characters using letters, numbers, underscore, or dash"
      );
    });
  });
});
