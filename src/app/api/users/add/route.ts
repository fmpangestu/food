import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/healthy_food_recommendation";

export async function POST(req: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("healthy_food_recommendation");
    const usersCollection = db.collection("users");

    const body = await req.json();

    // Data validasi sederhana
    if (
      !body.name ||
      !body.email ||
      !body.weight ||
      !body.height ||
      !body.age ||
      !body.gender ||
      !body.activityLevel
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = await usersCollection.insertOne(body);

    return NextResponse.json({
      message: "User added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
