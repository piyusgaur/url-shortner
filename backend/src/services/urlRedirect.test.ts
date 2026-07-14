jest.mock("../models/urlMapping.js", () => ({
  UrlMapping: {
    findOneAndUpdate: jest.fn(),
  },
}));

const { UrlMapping } = jest.requireMock("../models/urlMapping.js") as {
  UrlMapping: {
    findOneAndUpdate: jest.Mock;
  };
};

import { resolveShortCode } from "./urlRedirect.js";
import { ApiError } from "../errors/ApiError.js";

const mockFindOneAndUpdate = UrlMapping.findOneAndUpdate;

describe("resolveShortCode", () => {
  beforeEach(() => {
    mockFindOneAndUpdate.mockReset();
  });

  it("returns the original URL and updates analytics fields", async () => {
    const accessedAt = new Date("2026-07-14T12:00:00.000Z");

    mockFindOneAndUpdate.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        originalUrl: "https://example.com/",
        shortCode: "abc12345",
        clickCount: 7,
        lastAccessedAt: accessedAt,
      }),
    });

    const result = await resolveShortCode("abc12345");

    expect(result).toEqual({
      originalUrl: "https://example.com/",
      shortCode: "abc12345",
      clickCount: 7,
      lastAccessedAt: accessedAt,
    });
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { shortCode: "abc12345" },
      expect.objectContaining({
        $inc: { clickCount: 1 },
        $set: expect.objectContaining({
          lastAccessedAt: expect.any(Date),
        }),
      }),
      { new: true }
    );
  });

  it("rejects empty codes", async () => {
    await expect(resolveShortCode("   ")).rejects.toMatchObject({
      statusCode: 400,
      message: "code is required",
    });
  });

  it("returns 404 for unknown codes", async () => {
    mockFindOneAndUpdate.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(resolveShortCode("missing")).rejects.toMatchObject({
      statusCode: 404,
      message: "Short code not found",
    });
  });
});
