/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI_ATLAS as string; // gunakan connection string Atlas
const dbName = process.env.MONGODB_DB as string; // gunakan nama database dari env

export async function GET(request: NextRequest) {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const users = await db.collection("users").find({}).toArray();
    client.close();

    return Response.json(users, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch users", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    client.close();

    if (result.deletedCount === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Failed to delete user", error: String(error) },
      { status: 500 }
    );
  }
}
