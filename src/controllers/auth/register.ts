import type { Request, Response } from "express";
import { pool } from "../../db/connection";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcrypt";

interface RequestBody {
  email: string;
  first_name: string;
  password: string;
}

export async function register(
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
) {
  const { email, first_name, password } = req.body;

  const [existingUserRows] = await pool.query<RowDataPacket[]>(
    `
			select email
			from users
			where email = ?
		`,
    [email],
  );

  if (existingUserRows.length > 0) {
    throw new AppError(409, "A user with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await pool.query<ResultSetHeader>(
    `
			insert into users (email, first_name, hashed_password)
			values (?,?,?)
			`,
    [email, first_name, passwordHash],
  );

  console.log(newUser);

  res.json({ message: "You are in the register controller." });
}
