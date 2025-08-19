import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { name, email, username, password } = parsed.data;
  const existing = await prisma.user.findFirst({ where: { OR: [ { email }, { username } ] } });
  if (existing) return NextResponse.json({ error: "User exists" }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, username, passwordHash } });
  return NextResponse.json({ id: user.id });
}


