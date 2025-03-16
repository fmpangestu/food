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
async function importInitialData(): Promise<Food[]> {
  try {
    console.log("Mengimpor data dari CSV...");
    // Gunakan fetch untuk mengambil CSV dari /public
    const response = await fetch(
      new URL("/foods.csv", process.env.VERCEL_URL || "http://localhost:3000")
    );
    if (!response.ok)
      throw new Error(`Failed to fetch CSV: ${response.status}`);

    const csvData = await response.text();
    console.log(`CSV data loaded, length: ${csvData.length} bytes`);

    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    console.log(`Parsed data: ${parsedData.data.length} items`);
    return parsedData.data as Food[];
  } catch (error) {
    console.error("Error importing data:", error);
    return [];
  }
}

export async function readFoods(): Promise<Food[]> {
  try {
    console.log("Mencoba membaca data dari KV...");
    const foods = await kv.get<Food[]>("foods");

    console.log(
      "Status data dari KV:",
      foods ? `Ditemukan ${foods.length} item` : "Data kosong"
    );

    // Perbaikan: Periksa apakah foods adalah array dan tidak kosong
    if (!foods || !Array.isArray(foods)) {
      console.log("Mengimpor data awal dari CSV karena data tidak valid...");
      const initialData = await importInitialData();
      console.log(`Data dari CSV: ${initialData.length} item`);

      console.log("Menyimpan data ke KV...");
      await kv.set("foods", initialData);
      return initialData;
    }

    return foods;
  } catch (error) {
    console.error("ERROR MEMBACA DATA:", error);
    return [];
  }
}

export async function addFood(newFood: Food): Promise<boolean> {
  const foods = await readFoods();
  foods.push(newFood);
  await kv.set("foods", foods);
  return true;
}

export async function updateFood(
  name: string,
  updatedFood: Food
): Promise<boolean> {
  const foods = await readFoods();
  const index = foods.findIndex((food) => food.name === name);

  if (index !== -1) {
    foods[index] = updatedFood;
    await kv.set("foods", foods);
    return true;
  }

  return false;
}

export async function deleteFood(name: string): Promise<boolean> {
  const foods = await readFoods();
  const filteredFoods = foods.filter((food) => food.name !== name);

  if (filteredFoods.length < foods.length) {
    await kv.set("foods", filteredFoods);
    return true;
  }

  return false;
}

// Fungsi tambahan untuk mendapatkan makanan berdasarkan nama
export async function getFoodByName(name: string): Promise<Food | null> {
  const foods = await readFoods();
  return foods.find((food) => food.name === name) || null;
}
