/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { readCSV } from "@/lib/csvReader";
import { updateFood } from "@/lib/csvWriter";
import {
  deleteFoodFromServer,
  readCsvFromServer,
  updateFoodInServer,
} from "@/lib/serverCsvHandler";

type RouteParams = {
  params: {
    id: string;
  };
};
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = decodeURIComponent(params.id);
    const foods = await readCsvFromServer();
    const food = foods.find((food) => food.name === id);

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch food" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = decodeURIComponent(params.id);
    const updatedFood = await request.json();

    const success = await updateFoodInServer(id, updatedFood);

    if (success) {
      return NextResponse.json({ success: true, food: updatedFood });
    } else {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update food" },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: RouteParams
// ) {
//   try {
//     const id = params.id;
//     const success = await deleteFood(id);

//     if (success) {
//       return NextResponse.json({ success: true });
//     } else {
//       return NextResponse.json({ error: "Food not found" }, { status: 404 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete food" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = decodeURIComponent(params.id);

    console.log(`API: Mencoba menghapus makanan dengan id "${id}"`);

    // Tambahkan logging untuk membantu debugging
    const success = await deleteFoodFromServer(id);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      // Pastikan response mengembalikan objek dengan properti error
      console.error(`Makanan dengan nama "${id}" tidak ditemukan`);
      return NextResponse.json(
        { error: `Makanan "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("API DELETE error:", error);
    return NextResponse.json(
      { error: `Gagal menghapus makanan: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
