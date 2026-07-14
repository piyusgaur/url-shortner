import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next();
    return;
  }

  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
}
