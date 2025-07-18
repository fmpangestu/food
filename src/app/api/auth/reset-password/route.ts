import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { username, newPassword } = await request.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const user = await db.collection("users").findOne({ username });
  if (!user) {
    return NextResponse.json(
      { error: "Username tidak ditemukan." },
      { status: 404 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db
    .collection("users")
    .updateOne({ username }, { $set: { password: hashed } });

  return NextResponse.json({ message: "Password berhasil direset." });
}
