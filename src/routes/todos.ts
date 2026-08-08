import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todos";

export const todoRouter = Router();

todoRouter.post("/create", authenticate, createTodo);
todoRouter.get("/", authenticate, getTodos);
todoRouter.get("/:id", authenticate, getTodo);
todoRouter.patch("/:id", authenticate, updateTodo);
todoRouter.delete("/:id", authenticate, deleteTodo);
