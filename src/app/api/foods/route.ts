/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
// import { readCSV } from "@/lib/csvReader";
// import { addFood } from "@/lib/csvWriter";
import {
  readCsvFromServer,
  addFoodToServer,
  deleteFoodFromServer,
} from "@/lib/serverCsvHandler";
import { readFoods, addFood } from "@/lib/kvHandler";
// export async function GET() {
//   try {
//     const foods = await readCSV("/foods.csv");
//     return NextResponse.json(foods);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch foods" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const newFood = await request.json();

//     // Validate food data
//     if (!newFood.name || !newFood.calories) {
//       return NextResponse.json(
//         { error: "Name and calories are required" },
//         { status: 400 }
//       );
//     }

//     const success = await addFood(newFood);

//     if (success) {
//       return NextResponse.json({ success: true, food: newFood });
//     } else {
//       return NextResponse.json(
//         { error: "Food with this name already exists" },
//         { status: 409 }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to add food" }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     console.log("API: Reading foods from server CSV");
//     const foods = await readFoods();
//     console.log(`API: Found ${foods.length} foods`);
//     return NextResponse.json(foods);
//   } catch (error) {
//     console.error("API GET error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch foods" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    console.log("API: Mengambil data makanan dari KV database");

    // Panggil readFoods() dengan error handling lebih detail
    let foods;
    try {
      foods = await readFoods();
      console.log("Data type dari readFoods():", typeof foods);
      console.log("Apakah array:", Array.isArray(foods));
    } catch (readError) {
      console.error("Error dalam readFoods():", readError);
      throw new Error(`readFoods() failed: ${readError}`);
    }

    // Validasi data sebelum mengembalikan response
    const validFoods = Array.isArray(foods) ? foods : [];

    console.log(`API: Ditemukan ${validFoods.length} makanan`);
    return NextResponse.json(validFoods);
  } catch (error) {
    // Error handling...
  }
}

export async function POST(request: NextRequest) {
  try {
    const newFood = await request.json();

    // Validate food data
    if (!newFood.name || !newFood.calories) {
      return NextResponse.json(
        { error: "Name and calories are required" },
        { status: 400 }
      );
    }

    console.log("API: Adding new food:", newFood.name);
    const success = await addFood(newFood);

    if (success) {
      return NextResponse.json({ success: true, food: newFood });
    } else {
      return NextResponse.json(
        { error: "Food with this name already exists" },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json({ error: "Failed to add food" }, { status: 500 });
  }
}
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = decodeURIComponent(params.id);

//     console.log(`API: Mencoba menghapus makanan dengan id ${id}`);
//     const success = await deleteFoodFromServer(id);

//     if (success) {
//       return NextResponse.json({ success: true });
//     } else {
//       console.error(`Makanan dengan nama '${id}' tidak ditemukan`);
//       return NextResponse.json(
//         { error: "Makanan tidak ditemukan" },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("API DELETE error:", error);
//     return NextResponse.json(
//       { error: `Gagal menghapus makanan: ${(error as Error).message}` },
//       { status: 500 }
//     );
//   }
// }
