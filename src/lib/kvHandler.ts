/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// lib/kvHandler.ts
import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";
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
    // Baca file CSV dari project root (bisa disesuaikan)
    const csvPath = path.join(process.cwd(), "public", "foods.csv");
    const csvData = fs.readFileSync(csvPath, "utf8");

    // Parse CSV ke array objek
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Convert numbers automatically
    });

    return parsedData.data as Food[];
  } catch (error) {
    console.error("Error importing initial data:", error);
    return [];
  }
}

export async function readFoods(): Promise<Food[]> {
  // Cek apakah data sudah di KV
  const foods = await kv.get<Food[]>("foods");

  if (!foods) {
    // Initial import from CSV jika belum ada di KV
    const initialData = await importInitialData();
    await kv.set("foods", initialData);
    return initialData;
  }

  return foods;
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
