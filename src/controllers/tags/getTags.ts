import type { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { Tag } from "../../types/tag";
import { pool } from "../../db/connection";

interface TagRow extends RowDataPacket, Tag {}

export async function getTags(req: Request, res: Response) {
  const [tags] = await pool.query<TagRow[]>(
    `
			select id, name
			from tags
			where user_id = ?
		`,
    [req.userId],
  );

  res.json({ tags });
}
