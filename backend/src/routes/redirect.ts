import { Router } from "express";
import { resolveShortCode } from "../services/urlRedirect.js";

export const redirectRouter = Router();

redirectRouter.get("/:code", async (req, res, next) => {
  try {
    const result = await resolveShortCode(req.params.code ?? "");

    res.redirect(301, result.originalUrl);
  } catch (error) {
    next(error);
  }
});
