import type { Request, Response } from "express";
import { createTodoSchema } from "./createTodo";
import z from "zod";
import { pool } from "../../db/connection";
import { ResultSetHeader } from "mysql2";
import { AppError } from "../../utils/AppError";

const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
});

const columnMap: Record<string, string> = {
  dueDate: "due_date",
};

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;
  const result = updateTodoSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, "Invalid todo data.");
  }

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(result.data)) {
    if (value !== undefined) {
      const column = columnMap[key] ?? key;
      fields.push(`${column} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new AppError(400, "Provide at least one field to update.");
  }

  const setClause = fields.join(", ");

  const [sqlResult] = await pool.query<ResultSetHeader>(
    `
      UPDATE todos
      SET ${setClause}
      WHERE id = ? AND user_id = ?
    `,
    [...values, id, req.userId],
  );

  if (sqlResult.affectedRows === 0) {
    throw new AppError(404, "Todo could not be found.");
  }

  res.json({ message: "You are in the updateTodo controller." });
}
