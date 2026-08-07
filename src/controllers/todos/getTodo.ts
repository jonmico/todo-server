import type { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { Todo } from "../../types/todo";
import { pool } from "../../db/connection";
import { AppError } from "../../utils/AppError";

interface TodoRow extends RowDataPacket, Todo {}

export async function getTodo(req: Request, res: Response) {
  const { id } = req.params;

  const [todo] = await pool.query<TodoRow[]>(
    `
			SELECT * 
			FROM todos
			WHERE id = ? AND user_id = ?
		`,
    [id, req.userId],
  );

  if (todo.length === 0) {
    throw new AppError(404, "Todo not found.");
  }

  res.json({ todo: todo[0] });
}
