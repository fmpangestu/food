import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";

export async function POST(request: Request) {
  const { username } = await request.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const user = await db.collection("users").findOne({ username });
  return NextResponse.json({ exists: !!user });
}
