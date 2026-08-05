import { Router } from "express";
import { login, logout, register } from "../controllers/auth";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
