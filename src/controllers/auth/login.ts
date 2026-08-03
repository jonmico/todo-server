import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";
import { RowDataPacket } from "mysql2";
import { pool } from "../../db/connection";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/signToken";
import { cookieOptions } from "../../utils/cookieOptions";

interface UserRows extends RowDataPacket {
  id: string;
  first_name: string;
  email: string;
  hashed_password: string;
}

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    console.error(result.error);
    throw new AppError(400, "Invalid login data.");
  }

  const [userRow] = await pool.query<UserRows[]>(
    `
			select id, first_name, email, hashed_password
			from users
			where email = ?
		`,
    [result.data.email],
  );

  if (userRow.length === 0) {
    throw new AppError(401, "Incorrect email or password.");
  }

  const isValid = await bcrypt.compare(
    result.data.password,
    userRow[0].hashed_password,
  );

  if (!isValid) {
    throw new AppError(401, "Incorrect email or password.");
  }

  const user = userRow[0];

  const jwt = await signToken(user.id);

  res.cookie("jwt", jwt, cookieOptions).json({
    user: { id: user.id, email: user.email, firstName: user.first_name },
  });
}
