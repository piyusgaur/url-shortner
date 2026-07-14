import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode =
    error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
      ? error.statusCode
      : 500;

  const message = error instanceof Error ? error.message : "Internal Server Error";

  console.error(error);

  res.status(statusCode).json({
    error: message,
  });
}
