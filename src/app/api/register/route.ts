import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { saltAndHashPassword } from "@/lib/shared/password";
import { userRegisterSchema } from "@/lib/zod";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const parsed = userRegisterSchema.safeParse(data);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { name, email, username, password } = parsed.data;
  const existing = await db.user.findByEmailOrUsername(email, username);
  if (existing)
    return NextResponse.json({ error: "User exists" }, { status: 409 });

  const passwordHash = await saltAndHashPassword(password);
  if (typeof passwordHash !== "string") {
    return NextResponse.json(
      { error: "Failed to hash password" },
      { status: 500 }
    );
  }

  const user = await db.user.create({ name, email, username, passwordHash });

  return NextResponse.json({ id: user.id });
}
