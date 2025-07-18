/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan path sesuai

const uri = process.env.MONGODB_URI_ATLAS!;
const dbName = "test";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  // Hanya tampilkan history milik user yang sedang login
  const data = await db.collection("userSelections").find({ userId }).toArray();

  client.close();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id, clearAll } = await req.json();
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  if (clearAll) {
    // Hapus semua history milik user yang sedang login
    await db.collection("userSelections").deleteMany({ userId });
  } else if (id) {
    // Pastikan hanya bisa hapus milik sendiri
    await db
      .collection("userSelections")
      .deleteOne({ _id: new ObjectId(id), userId });
  }
  client.close();
  return NextResponse.json({ success: true });
}
