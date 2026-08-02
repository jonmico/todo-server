import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  signed: true,
  maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
};
