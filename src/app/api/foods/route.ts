/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/healthy_food_recommendation";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const maxCalories = url.searchParams.get("maxCalories");
    const category = url.searchParams.get("category");

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("healthy_food_recommendation");
    const foodsCollection = db.collection("foods");

    const filters: any = {};
    if (maxCalories) filters.calories = { $lte: parseInt(maxCalories) };
    if (category) filters.category = category;

    const foods = await foodsCollection.find(filters).toArray();

    return NextResponse.json(foods);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    );
  }
}
