jest.mock("../models/urlMapping.js", () => ({
  UrlMapping: {
    findOne: jest.fn(),
    create: jest.fn(),
    exists: jest.fn(),
  },
}));

const { UrlMapping } = jest.requireMock("../models/urlMapping.js") as {
  UrlMapping: {
    findOne: jest.Mock;
    create: jest.Mock;
    exists: jest.Mock;
  };
};

import { shortenUrl } from "./urlShortener.js";
import { ApiError } from "../errors/ApiError.js";

const mockFindOne = UrlMapping.findOne;
const mockCreate = UrlMapping.create;
const mockExists = UrlMapping.exists;

describe("shortenUrl", () => {
  beforeEach(() => {
    mockFindOne.mockReset();
    mockCreate.mockReset();
    mockExists.mockReset();
  });

  it("creates a new short code for a valid URL", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    mockExists.mockResolvedValue(false);
    mockCreate.mockImplementation(async (doc) => doc);

    const result = await shortenUrl({ url: "https://example.com" });

    expect(result.created).toBe(true);
    expect(result.originalUrl).toBe("https://example.com/");
    expect(result.shortCode).toMatch(/^[A-Za-z0-9_-]{8}$/);
    expect(mockCreate).toHaveBeenCalledWith({
      originalUrl: "https://example.com/",
      shortCode: expect.stringMatching(/^[A-Za-z0-9_-]{8}$/),
    });
  });

  it("returns the existing mapping when the same URL is shortened twice", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        originalUrl: "https://example.com/",
        shortCode: "abc12345",
      }),
    });

    const result = await shortenUrl({ url: "https://example.com" });

    expect(result).toEqual({
      originalUrl: "https://example.com/",
      shortCode: "abc12345",
      created: false,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("accepts a custom alias for a new mapping", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    mockCreate.mockImplementation(async (doc) => doc);

    const result = await shortenUrl({
      url: "https://example.com/docs",
      alias: "docs123",
    });

    expect(result).toEqual({
      originalUrl: "https://example.com/docs",
      shortCode: "docs123",
      created: true,
    });
  });

  it("rejects invalid URLs", async () => {
    await expect(shortenUrl({ url: "not-a-url" })).rejects.toBeInstanceOf(ApiError);
    await expect(shortenUrl({ url: "not-a-url" })).rejects.toMatchObject({
      statusCode: 400,
      message: "URL must be valid",
    });
  });

  it("rejects invalid aliases", async () => {
    await expect(
      shortenUrl({ url: "https://example.com", alias: "bad alias" })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Alias must be 3-64 characters using letters, numbers, underscore, or dash",
    });
  });

  it("rejects a different alias for an existing URL", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        originalUrl: "https://example.com/",
        shortCode: "abc12345",
      }),
    });

    await expect(
      shortenUrl({ url: "https://example.com", alias: "newalias" })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "This URL already has a different short code",
    });
  });

  it("turns duplicate key errors into a conflict response", async () => {
    mockFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    mockExists.mockResolvedValue(false);
    mockCreate.mockRejectedValue({ code: 11000 });

    await expect(shortenUrl({ url: "https://example.com" })).rejects.toMatchObject({
      statusCode: 409,
      message: "Short code already exists",
    });
  });
});
