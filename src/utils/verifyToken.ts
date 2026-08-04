import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

export async function verifyToken(jwt: string) {
  const { payload } = await jwtVerify(jwt, secret);

  return payload;
}
