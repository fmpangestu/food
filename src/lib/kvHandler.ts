/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// lib/kvHandler.ts
import { kv } from "@vercel/kv";
// import fs from "fs";
// import path from "path";
// @ts-ignore
import Papa from "papaparse";

// Definisikan interface untuk tipe makanan
interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
  [key: string]: any; // Untuk properti tambahan yang mungkin ada
}

// Fungsi untuk initial import dari CSV saat pertama kali
// async function importInitialData(): Promise<Food[]> {
//   try {
//     console.log("Mengimpor data dari CSV...");
//     // Gunakan fetch untuk mengambil CSV dari /public
//     const response = await fetch(
//       new URL("/foods.csv", process.env.VERCEL_URL || "http://localhost:3000")
//     );
//     if (!response.ok)
//       throw new Error(`Failed to fetch CSV: ${response.status}`);

//     const csvData = await response.text();
//     console.log(`CSV data loaded, length: ${csvData.length} bytes`);

//     const parsedData = Papa.parse(csvData, {
//       header: true,
//       skipEmptyLines: true,
//       dynamicTyping: true,
//     });

//     console.log(`Parsed data: ${parsedData.data.length} items`);
//     return parsedData.data as Food[];
//   } catch (error) {
//     console.error("Error importing data:", error);
//     return [];
//   }
// }

async function importInitialData(): Promise<Food[]> {
  try {
    console.log("Mengimpor data dari CSV...");

    // Perbaiki URL untuk Vercel
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    console.log(`Mengakses CSV dari: ${baseUrl}/foods.csv`);

    const response = await fetch(`${baseUrl}/foods.csv`);
    if (!response.ok)
      throw new Error(`Failed to fetch CSV: ${response.status}`);

    const csvData = await response.text();
    console.log(`CSV data loaded, length: ${csvData.length} bytes`);

    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    // Pastikan data valid
    const validData = (parsedData.data || [])
      .filter((item: any) => item && typeof item === "object")
      .map((item: any) => ({
        name: String(item.name || ""),
        calories: Number(item.calories || 0),
        protein: Number(item.protein || 0),
        fat: Number(item.fat || 0),
        carbs: Number(item.carbs || 0),
        sodium: Number(item.sodium || 0),
        porpotionSize: Number(item.porpotionSize || 0),
      }));

    console.log(`Parsed and validated data: ${validData.length} items`);
    return validData;
  } catch (error) {
    console.error("Error importing data from CSV:", error);
    return [];
  }
}

// export async function readFoods(): Promise<Food[]> {
//   try {
//     console.log("Mencoba membaca data dari KV...");
//     const foods = await kv.get<Food[]>("foods");

//     console.log(
//       "Status data dari KV:",
//       foods ? `Ditemukan ${foods.length} item` : "Data kosong"
//     );

//     // Perbaikan: Periksa apakah foods adalah array dan tidak kosong
//     if (!foods || !Array.isArray(foods)) {
//       console.log("Mengimpor data awal dari CSV karena data tidak valid...");
//       const initialData = await importInitialData();
//       console.log(`Data dari CSV: ${initialData.length} item`);

//       console.log("Menyimpan data ke KV...");
//       await kv.set("foods", initialData);
//       return initialData;
//     }

//     return foods;
//   } catch (error) {
//     console.error("ERROR MEMBACA DATA:", error);
//     return [];
//   }
// }

export async function readFoods(): Promise<Food[]> {
  try {
    console.log("Mencoba membaca data dari KV...");
    const foods = await kv.get<Food[]>("foods");

    // Log lebih detail untuk debugging
    console.log("Tipe data dari KV:", typeof foods);
    console.log("Apakah array:", Array.isArray(foods));

    if (foods) {
      console.log(
        "Status data dari KV: Ditemukan",
        Array.isArray(foods) ? foods.length : 0,
        "item"
      );
    } else {
      console.log("Status data dari KV: Data kosong");
    }

    // PERBAIKAN: Pastikan foods adalah array dengan benar
    // Jika data ada tapi bukan array, atau array tapi kosong, mungkin perlu diisi dari CSV
    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      console.log(
        "Data KV tidak valid atau kosong, mencoba mengimpor dari CSV..."
      );

      try {
        const initialData = await importInitialData();
        console.log(`Data dari CSV: ${initialData.length} item`);

        if (initialData.length > 0) {
          console.log("Menyimpan data dari CSV ke KV...");
          await kv.set("foods", initialData);
          return initialData;
        } else {
          console.log("CSV juga kosong, mengembalikan array kosong");
          return [];
        }
      } catch (importError) {
        console.error("Error saat import dari CSV:", importError);
        // Jika import gagal, kembali ke data KV yang ada (mungkin kosong atau bukan array)
        return Array.isArray(foods) ? foods : [];
      }
    }

    // Data dari KV sudah valid, langsung kembalikan
    console.log(`Mengembalikan ${foods.length} item dari KV`);
    return foods;
  } catch (error) {
    console.error("ERROR MEMBACA DATA KV:", error);
    // Jika total gagal, coba import dari CSV sebagai fallback
    try {
      console.log("Mencoba fallback ke CSV...");
      return await importInitialData();
    } catch (fallbackError) {
      console.error("Fallback ke CSV juga gagal:", fallbackError);
      return [];
    }
  }
}
export async function addFood(newFood: Food): Promise<boolean> {
  const foods = await readFoods();
  foods.push(newFood);
  await kv.set("foods", foods);
  return true;
}

export async function updateFood(
  Menu: string,
  updatedFood: Food
): Promise<boolean> {
  const foods = await readFoods();
  const index = foods.findIndex((food) => food.Menu === Menu);

  if (index !== -1) {
    foods[index] = updatedFood;
    await kv.set("foods", foods);
    return true;
  }

  return false;
}

export async function deleteFood(Menu: string): Promise<boolean> {
  const foods = await readFoods();
  const filteredFoods = foods.filter((food) => food.Menu !== Menu);

  if (filteredFoods.length < foods.length) {
    await kv.set("foods", filteredFoods);
    return true;
  }

  return false;
}

// Fungsi tambahan untuk mendapatkan makanan berdasarkan nama
export async function getFoodByName(Menu: string): Promise<Food | null> {
  const foods = await readFoods();
  return foods.find((food) => food.Menu === Menu) || null;
}
