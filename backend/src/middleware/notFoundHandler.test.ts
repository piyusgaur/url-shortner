import { notFoundHandler } from "./notFoundHandler.js";

describe("notFoundHandler", () => {
  it("calls next when headers have already been sent", () => {
    const req = { originalUrl: "/done" } as never;
    const res = { headersSent: true, status: jest.fn(), json: jest.fn() } as never;
    const next = jest.fn();

    notFoundHandler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns a json 404 response when the route is unknown", () => {
    const req = { originalUrl: "/missing" } as never;
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { headersSent: false, status, json } as never;
    const next = jest.fn();

    notFoundHandler(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      error: "Not Found",
      path: "/missing",
    });
  });
});
