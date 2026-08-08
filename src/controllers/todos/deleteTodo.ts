import type { Request, Response } from "express";
import { pool } from "../../db/connection";
import { ResultSetHeader } from "mysql2";
import { AppError } from "../../utils/AppError";

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    `
      DELETE FROM todos
      WHERE id = ? AND user_id = ?;
    `,
    [id, req.userId],
  );

  if (result.affectedRows === 0) {
    throw new AppError(404, "Todo not found.");
  }

  res.status(204).end();
}
