import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/verifyToken";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const jwt = req.signedCookies.jwt as string | undefined;

  if (!jwt) {
    throw new AppError(401, "Not authenticated.");
  }

  try {
    const payload = await verifyToken(jwt);

    req.userId = payload.id as string;

    return next();
  } catch {
    throw new AppError(401, "Not authenticated.");
  }
}
