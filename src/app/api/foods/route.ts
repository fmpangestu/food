/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "../../../lib/mongodb_atlas";
import { Food } from "../../../types/food"; // Impor tipe Food

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const foods = await db.collection<Food>("foods").find({}).toArray();

    return NextResponse.json(foods, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const newFood: Food = await request.json();

    if (!("kategori" in newFood)) {
      newFood.kategori = "";
    }
    // Validasi sederhana
    if (!newFood.Menu || typeof newFood.Menu !== "string") {
      return NextResponse.json(
        { error: "Food name ('Menu') is required and must be a string." },
        { status: 400 }
      );
    }

    // Cek duplikasi
    const existingFood = await db
      .collection<Food>("foods")
      .findOne({ Menu: newFood.Menu });
    if (existingFood) {
      return NextResponse.json(
        { error: `Food with name "${newFood.Menu}" already exists.` },
        { status: 409 }
      ); // 409 Conflict
    }

    // Remove _id if it exists and is not a valid ObjectId
    if (
      "_id" in newFood &&
      (typeof newFood._id !== "object" ||
        newFood._id === undefined ||
        (newFood._id && typeof newFood._id === "string"))
    ) {
      delete (newFood as any)._id;
    }

    const result = await db
      .collection("foods")
      .insertOne(newFood as Omit<Food, "_id">);
    return NextResponse.json(
      { message: "Food added successfully", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add food" }, { status: 500 });
  }
}
