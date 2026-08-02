import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(id: string) {
  const jwt = await new SignJWT({ id })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("2 weeks")
    .sign(secret);

  return jwt;
}
