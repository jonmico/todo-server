import type { Request, Response } from "express";
import { createTodoSchema } from "./createTodo";
import z from "zod";

const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
});

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;
  const result = updateTodoSchema.safeParse(req.body);

  console.log(result, id);

  res.json({ message: "You are in the updateTodo controller." });
}
