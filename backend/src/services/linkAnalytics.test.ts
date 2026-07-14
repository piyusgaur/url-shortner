import { getLinkAnalytics } from "./linkAnalytics.js";
import { ApiError } from "../errors/ApiError.js";

jest.mock("../models/urlMapping.js", () => ({
  UrlMapping: {
    findOne: jest.fn(),
  },
}));

const { UrlMapping } = jest.requireMock("../models/urlMapping.js") as {
  UrlMapping: {
    findOne: jest.Mock;
  };
};

const mockFindOne = UrlMapping.findOne;

describe("getLinkAnalytics", () => {
  beforeEach(() => {
    mockFindOne.mockReset();
  });

  it("returns analytics for a valid short code", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        originalUrl: "https://example.com/",
        shortCode: "abc12345",
        clickCount: 9,
        lastAccessedAt: new Date("2026-07-14T14:00:00.000Z"),
        createdAt: new Date("2026-07-14T13:00:00.000Z"),
        updatedAt: new Date("2026-07-14T14:00:00.000Z"),
      }),
    });

    const result = await getLinkAnalytics("abc12345");

    expect(result.shortCode).toBe("abc12345");
    expect(result.clickCount).toBe(9);
    expect(result.originalUrl).toBe("https://example.com/");
  });

  it("rejects empty codes", async () => {
    await expect(getLinkAnalytics("   ")).rejects.toMatchObject({
      statusCode: 400,
      message: "code is required",
    });
  });

  it("returns 404 for unknown codes", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(getLinkAnalytics("missing")).rejects.toMatchObject({
      statusCode: 404,
      message: "Short code not found",
    });
  });
});
