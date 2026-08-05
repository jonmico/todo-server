import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";
import { pool } from "../../db/connection";
import { ResultSetHeader } from "mysql2";

const createTodoSchema = z.object({
  title: z.string().trim().min(8),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export async function createTodo(req: Request, res: Response) {
  const result = createTodoSchema.safeParse(req.body);

  if (!result.success) {
    // TODO: Maybe expand this error handling a little bit more.
    console.error(result.error);
    throw new AppError(400, "Invalid todo data.");
  }

  // TODO: Handle error when INSERT fails/affectedRows !== 1?
  const [todoResult] = await pool.query<ResultSetHeader>(
    `
			insert into todos (title, description, due_date, user_id)
			values (?,?,?,?)
		`,
    [
      result.data.title,
      result.data.description,
      result.data.dueDate,
      req.userId,
    ],
  );

  // TODO: Do I need this? If affectedRows === 0, there would probably be a failure/error thrown which would
  // get caught in index.ts.
  if (todoResult.affectedRows === 0) {
    throw new AppError(500, "Something went wrong.");
  }

  res.status(201).json({ message: "Todo created." });
}
