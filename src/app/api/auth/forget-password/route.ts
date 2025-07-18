import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";

export async function POST(request: Request) {
  const { username } = await request.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const user = await db.collection("users").findOne({ username });
  if (!user)
    return NextResponse.json(
      { error: "Username tidak ditemukan." },
      { status: 404 }
    );

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await db
    .collection("users")
    .updateOne(
      { username },
      { $set: { resetOtp: otp, resetOtpExpire: Date.now() + 10 * 60 * 1000 } }
    );

  // Untuk demo, return OTP di response
  return NextResponse.json({ message: "OTP dikirim.", otp });
}
