import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI_ATLAS as string;
const dbName = process.env.MONGODB_DB as string;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, birthDate } = await request.json();
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { username: name, birthDate } }
      );
    client.close();

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "User not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user", error: String(error) },
      { status: 500 }
    );
  }
}
