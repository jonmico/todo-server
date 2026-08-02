import type { Request, Response } from "express";
import { pool } from "../../db/connection";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/signToken";
import { cookieOptions } from "../../utils/cookieOptions";

interface RequestBody {
  email: string;
  first_name: string;
  password: string;
}

interface NewUserRows extends RowDataPacket {
  id: string;
  email: string;
  first_name: string;
}

// TODO: Should we add in Zod or Joi validation?

export async function register(
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
) {
  // TODO: Validate these fields
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

  await pool.query<ResultSetHeader>(
    `
			insert into users (email, first_name, hashed_password)
			values (?,?,?)
			`,
    [email, first_name, passwordHash],
  );

  const [newUserRows] = await pool.query<NewUserRows[]>(
    `
      select id, email, first_name
      from users
      where email = ?
    `,
    [email],
  );

  const newUser = newUserRows[0];

  const jwt = await signToken(newUser.id);

  res
    .status(201)
    .cookie("jwt", jwt, cookieOptions)
    .json({
      user: {
        email: newUser.email,
        id: newUser.id,
        firstName: newUser.first_name,
      },
    });
}
