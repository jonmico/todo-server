import { Router } from "express";
import { createTodo } from "../controllers/todos/createTodo";
import { authenticate } from "../middleware/authenticate";

export const todoRouter = Router();

todoRouter.post("/create", authenticate, createTodo);
