import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  _res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${duration}ms`);
  });

  next();
}
