import { errorHandler } from "./errorHandler.js";

describe("errorHandler", () => {
  it("returns the status code from Error instances with a statusCode", () => {
    const error = new Error("teapot") as Error & { statusCode: number };
    error.statusCode = 418;

    const req = {} as never;
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json } as never;
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(418);
    expect(json).toHaveBeenCalledWith({ error: "teapot" });
  });

  it("falls back to 500 for non-error values", () => {
    const req = {} as never;
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json } as never;
    const next = jest.fn();

    errorHandler("boom", req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
