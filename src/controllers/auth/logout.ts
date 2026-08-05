import type { Request, Response } from "express";
import { cookieOptions } from "../../utils/cookieOptions";

export function logout(_req: Request, res: Response) {
  res.clearCookie("jwt", cookieOptions).json({ message: "Logged out." });
}
