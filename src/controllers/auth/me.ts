import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { pool } from "../../db/connection";
import { AppError } from "../../utils/AppError";

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  first_name: string;
}

export async function getMe(req: Request, res: Response) {
  const [userRows] = await pool.query<UserRow[]>(
    `
			SELECT email, first_name
			FROM users
			WHERE id = ?
		`,
    [req.userId],
  );

  if (userRows.length === 0) {
    throw new AppError(404, "User not found.");
  }

  res.json({
    user: {
      id: req.userId,
      email: userRows[0].email,
      firstName: userRows[0].first_name,
    },
  });
}
