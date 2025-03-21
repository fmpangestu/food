/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import {
  deleteFoodFromServer,
  readCsvFromServer,
  updateFoodInServer,
} from "@/lib/serverCsvHandler";
import { getFoodByName, updateFood, deleteFood } from "@/lib/kvHandler";
// export async function GET(request: NextRequest) {
//   try {
//     const id = request.nextUrl.pathname.split("/").pop(); // Ambil id dari URL
//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     const foods = await readCsvFromServer();
//     const food = foods.find((food) => food.name === decodeURIComponent(id));

//     if (!food) {
//       return NextResponse.json({ error: "Food not found" }, { status: 404 });
//     }

//     return NextResponse.json(food);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch food" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Ambil id dari URL
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // PERBAIKAN: Gunakan getFoodByName dari KV, bukan readCsvFromServer
    const decodedId = decodeURIComponent(id);
    const food = await getFoodByName(decodedId);

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error("GET food error:", error);
    return NextResponse.json(
      { error: "Failed to fetch food" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Ambil id dari URL
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedFood = await request.json();
    const success = await updateFood(decodeURIComponent(id), updatedFood);

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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Ambil id dari URL
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    console.log(`API: Mencoba menghapus makanan dengan id "${id}"`);
    const success = await deleteFood(decodeURIComponent(id));

    if (success) {
      return NextResponse.json({ success: true });
    } else {
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
