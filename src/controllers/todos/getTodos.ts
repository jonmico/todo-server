import type { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { pool } from "../../db/connection";
import { Todo } from "../../types/todo";

// interface TodoTagRow extends RowDataPacket {
//   todo_id: string;
//   user_id: string;
//   title: string;
//   description: string | null;
//   completed: number;
//   due_date: Date | null;
//   created_at: Date;
//   updated_at: Date;
//   tag_id: string | null;
//   tag_name: string | null;
// }

interface TodoRow extends RowDataPacket, Todo {
  completed: number;
}

export async function getTodos(req: Request, res: Response) {
  // const [todos] = await pool.query<TodoTagRow[]>(
  //   `
  //     SELECT todo.id AS todo_id, todo.title, todo.description, todo.completed,
  //       todo.due_date, todo.created_at, todo.updated_at,
  //       tag.id AS tag_id, tag.name AS tag_name
  //     FROM todos todo
  //     LEFT JOIN todo_tags tt ON tt.todo_id = todo.id
  //     LEFT JOIN tags tag ON tag.id = tt.tag_id
  //     WHERE todo.user_id = ?
  //     `,
  //   [req.userId],
  // );

  const [todos] = await pool.query<TodoRow[]>(
    `
      SELECT *
      FROM todos
      WHERE user_id = ?
    `,
    [req.userId],
  );

  res.json({ todos });
}
