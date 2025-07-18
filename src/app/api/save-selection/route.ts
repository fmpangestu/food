import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await MongoClient.connect(process.env.MONGODB_URI_ATLAS!);
  const db = client.db("test"); // Ganti sesuai nama DB Atlas kamu
  await db.collection("userSelections").insertOne({
    ...data,
    createdAt: new Date(),
  });
  await client.close();
  return NextResponse.json({ success: true });
}
