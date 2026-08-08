import type { Request, Response } from "express";

export async function deleteTodo(req: Request, res: Response) {
  res.json({ message: "You are in the deleteTodo controller!" });
}
