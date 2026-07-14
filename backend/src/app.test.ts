import request from "supertest";
import { app } from "./app.js";
import { ApiError } from "./errors/ApiError.js";
import { shortenUrl } from "./services/urlShortener.js";
import { resolveShortCode } from "./services/urlRedirect.js";

jest.mock("./services/urlShortener.js", () => ({
  shortenUrl: jest.fn(),
}));

jest.mock("./services/urlRedirect.js", () => ({
  resolveShortCode: jest.fn(),
}));

const mockShortenUrl = shortenUrl as jest.MockedFunction<typeof shortenUrl>;
const mockResolveShortCode = resolveShortCode as jest.MockedFunction<typeof resolveShortCode>;

describe("app routes", () => {
  beforeEach(() => {
    mockShortenUrl.mockReset();
    mockResolveShortCode.mockReset();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("shortens URLs through the HTTP API", async () => {
    mockShortenUrl.mockResolvedValue({
      originalUrl: "https://example.com/",
      shortCode: "abc12345",
      created: true,
    });

    const response = await request(app)
      .post("/shorten")
      .send({ url: "https://example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      originalUrl: "https://example.com/",
      shortCode: "abc12345",
      created: true,
    });
    expect(response.body.shortUrl).toMatch(/^http:\/\/.+\/abc12345$/);
    expect(mockShortenUrl).toHaveBeenCalledWith({
      url: "https://example.com",
      alias: undefined,
    });
  });

  it("rejects shorten requests without a URL", async () => {
    const response = await request(app).post("/shorten").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "url is required" });
  });

  it("redirects known codes", async () => {
    mockResolveShortCode.mockResolvedValue({
      originalUrl: "https://example.com/",
      shortCode: "abc12345",
      clickCount: 8,
      lastAccessedAt: new Date("2026-07-14T12:00:00.000Z"),
    });

    const response = await request(app).get("/abc12345");

    expect(response.status).toBe(301);
    expect(response.headers.location).toBe("https://example.com/");
    expect(mockResolveShortCode).toHaveBeenCalledWith("abc12345");
  });

  it("returns 404 for unknown codes", async () => {
    mockResolveShortCode.mockRejectedValue(new ApiError(404, "Short code not found"));

    const response = await request(app).get("/missing-code");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Short code not found" });
  });

  it("returns 404 for non-existent routes", async () => {
    const response = await request(app).get("/not-a-real-route/extra");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Not Found",
      path: "/not-a-real-route/extra",
    });
  });
});
