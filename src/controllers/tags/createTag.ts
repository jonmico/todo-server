import type { Response, Request } from "express";
import z from "zod";
import { AppError } from "../../utils/AppError";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../db/connection";

interface TagRow extends RowDataPacket {
  id: string;
  name: string;
}

const createTagSchema = z.object({
  name: z.string().trim().min(3),
});

export async function createTag(req: Request, res: Response) {
  const result = createTagSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, "Invalid tag data.");
  }

  const [existingTagRows] = await pool.query<TagRow[]>(
    `
			select id, name
			from tags
			where user_id = ? and name = ?
		`,
    [req.userId, result.data.name],
  );

  if (existingTagRows.length > 0) {
    throw new AppError(409, "Tag already exists.");
  }

  await pool.query<ResultSetHeader>(
    `
			insert into tags (user_id, name)
			values (?, ?)
		`,
    [req.userId, result.data.name],
  );

  const [newTagRows] = await pool.query<TagRow[]>(
    `
			select id, name
			from tags
			where user_id = ? and name = ?;
		`,
    [req.userId, result.data.name],
  );

  const newTag = newTagRows[0];

  res.status(201).json({ tag: { id: newTag.id, name: newTag.name } });
}
