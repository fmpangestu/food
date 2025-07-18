/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "../../../../lib/mongodb_atlas";
import { Food } from "../../../../types/food";

// type RouteParams tidak diperlukan lagi

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Menggunakan DB dari connection string
    const name = decodeURIComponent(params.name);

    const food = await db.collection<Food>("foods").findOne({ Menu: name });

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    // Pastikan field kategori selalu ada walaupun kosong
    if (!("kategori" in food)) {
      (food as any).kategori = "";
    }

    return NextResponse.json(food, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch food" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const name = decodeURIComponent(params.name);
    const updatedData: Partial<Food> = await request.json();

    delete updatedData._id;

    if (!("kategori" in updatedData)) {
      updatedData.kategori = "";
    }

    const result = await db
      .collection<Food>("foods")
      .updateOne({ Menu: name }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Food updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update food" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const name = decodeURIComponent(params.name);

    const result = await db.collection<Food>("foods").deleteOne({ Menu: name });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: `Food "${name}" deleted successfully` },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete food" },
      { status: 500 }
    );
  }
}
