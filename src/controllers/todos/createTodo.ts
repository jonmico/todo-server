import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";
import { pool } from "../../db/connection";
import { ResultSetHeader } from "mysql2";
import { verifySyncTodoTags } from "../../utils/verifySyncTodoTags";
import { randomUUID } from "crypto";

// TODO: Consider moving shared Zod schemas to their own files.
export const createTodoSchema = z.object({
  title: z.string().trim().min(8),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  tagIds: z.array(z.string()).optional(),
});

export async function createTodo(req: Request, res: Response) {
  const result = createTodoSchema.safeParse(req.body);

  if (!result.success) {
    console.error(result.error);
    throw new AppError(400, "Invalid todo data.");
  }

  const { tagIds, ...todoFields } = result.data;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const uuid = randomUUID();

    const [todoResult] = await connection.query<ResultSetHeader>(
      `
			insert into todos (id, title, description, due_date, user_id)
			values (?,?,?,?,?)
		`,
      [
        uuid,
        todoFields.title,
        todoFields.description,
        todoFields.dueDate,
        req.userId,
      ],
    );

    if (todoResult.affectedRows === 0) {
      throw new AppError(500, "Something went wrong.");
    }

    if (tagIds !== undefined) {
      await verifySyncTodoTags(connection, uuid, tagIds, req.userId);
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  res.status(201).json({ message: "Todo created." });
}
