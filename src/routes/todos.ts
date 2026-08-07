import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { createTodo, getTodo, getTodos } from "../controllers/todos";

export const todoRouter = Router();

todoRouter.post("/create", authenticate, createTodo);
todoRouter.get("/", authenticate, getTodos);
todoRouter.get("/:id", authenticate, getTodo);
