import { Router } from "express";
import { getLinkAnalytics } from "../services/linkAnalytics.js";

export const analyticsRouter = Router();

analyticsRouter.get("/analytics/:code", async (req, res, next) => {
  try {
    const analytics = await getLinkAnalytics(req.params.code ?? "");

    res.json(analytics);
  } catch (error) {
    next(error);
  }
});
