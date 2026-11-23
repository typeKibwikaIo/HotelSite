import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./db";

const COOKIE = "admin_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, "hex"));
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function createSession(userId: string) {
  const payload = `${userId}.${Date.now()}`;
  const value = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminUser() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, , sig] = parts;
  const payload = parts.slice(0, 2).join(".");
  if (sign(payload) !== sig) return null;
  return prisma.adminUser.findUnique({ where: { id: userId } });
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
