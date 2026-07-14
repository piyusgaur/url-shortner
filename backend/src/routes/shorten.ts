import { Router } from "express";
import { shortenUrl } from "../services/urlShortener.js";
import { ApiError } from "../errors/ApiError.js";

export const shortenRouter = Router();

shortenRouter.post("/shorten", async (req, res, next) => {
  try {
    const body = req.body as { url?: string; alias?: string };

    if (!body || typeof body.url !== "string") {
      throw new ApiError(400, "url is required");
    }

    const result = await shortenUrl({
      url: body.url,
      alias: body.alias,
    });

    res.status(result.created ? 201 : 200).json({
      originalUrl: result.originalUrl,
      shortCode: result.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${result.shortCode}`,
      created: result.created,
    });
  } catch (error) {
    next(error);
  }
});
