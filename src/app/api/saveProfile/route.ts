/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, weight, height, age, gender, activityLevel } = body;

  const client = await clientPromise;
  const db = client.db("test"); // Ganti sesuai nama DB kamu
  const collection = db.collection("user_profiles");

  await collection.updateOne(
    { userId },
    { $set: { weight, height, age, gender, activityLevel } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const client = await clientPromise;
  const db = client.db("test"); // Ganti sesuai nama DB kamu
  const collection = db.collection("user_profiles");
  const user = await collection.findOne({ userId });

  if (!user) {
    return NextResponse.json({ formData: null });
  }
  // Hapus _id dan userId agar tidak masuk ke formData
  const { _id, userId: _userId, ...formData } = user;
  return NextResponse.json({ formData });
}
