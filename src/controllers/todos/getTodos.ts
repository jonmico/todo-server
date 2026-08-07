import type { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { pool } from "../../db/connection";
import { Todo } from "../../types/todo";

interface TodoRow extends RowDataPacket, Todo {}

export async function getTodos(req: Request, res: Response) {
  const [todos] = await pool.query<TodoRow[]>(
    `
			select *
			from todos
			where user_id = ?
		`,
    [req.userId],
  );

  res.json({ todos });
}
