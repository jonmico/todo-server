import { Router } from "express";
import { login, logout, register } from "../controllers/auth";
import { authenticate } from "../middleware/authenticate";
import { getMe } from "../controllers/auth/me";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", authenticate, getMe);
