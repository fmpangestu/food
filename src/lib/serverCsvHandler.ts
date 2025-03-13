// import fs from "fs";
// import path from "path";
// import { Food } from "@/types/food"; // We'll export this from your existing file

// // Define the CSV file path for server operations
// const csvFilePath = path.join(process.cwd(), "public", "foods.csv");

// // Server-side function to read the CSV directly from the filesystem
// export async function readCsvFromServer(): Promise<Food[]> {
//   try {
//     // Check if file exists
//     if (!fs.existsSync(csvFilePath)) {
//       console.error(`CSV file not found at ${csvFilePath}`);
//       return [];
//     }

//     // Read file content
//     const data = fs.readFileSync(csvFilePath, "utf-8");

//     // Parse CSV headers first to identify column positions
//     const lines = data.trim().split("\n");
//     if (lines.length === 0) {
//       return [];
//     }

//     const headers = lines[0].split(",");

//     // Find column indices based on your flexible naming scheme
//     const nameIndex = findColumnIndex(headers, [
//       "Menu",
//       "menu",
//       "Nama Makanan",
//     ]);
//     const caloriesIndex = findColumnIndex(headers, [
//       "Energy (kcal)",
//       "energy (kcal)",
//     ]);
//     const proteinIndex = findColumnIndex(headers, [
//       "Protein (g)",
//       "protein (g)",
//     ]);
//     const fatIndex = findColumnIndex(headers, ["Fat (g)", "fat (g)"]);
//     const carbsIndex = findColumnIndex(headers, [
//       "Carbohydrates (g)",
//       "carbohydrates (g)",
//     ]);
//     const sodiumIndex = findColumnIndex(headers, [
//       "Sodium (mg)",
//       "sodium (mg)",
//     ]);
//     const portionSizeIndex = findColumnIndex(headers, [
//       "Portion Size (g)",
//       "portion size (g)",
//       "Portion Size",
//     ]);

//     // Parse the CSV rows
//     const foods: Food[] = [];

//     for (let i = 1; i < lines.length; i++) {
//       const line = lines[i].trim();
//       if (!line) continue;

//       const values = line.split(",");

//       // Map to the same format your application expects
//       const food: Food = {
//         name:
//           nameIndex >= 0
//             ? String(values[nameIndex] || "Unknown Food")
//             : "Unknown Food",
//         calories:
//           caloriesIndex >= 0 ? parseFloat(values[caloriesIndex]) || 0 : 0,
//         protein: proteinIndex >= 0 ? parseFloat(values[proteinIndex]) || 0 : 0,
//         fat: fatIndex >= 0 ? parseFloat(values[fatIndex]) || 0 : 0,
//         carbs: carbsIndex >= 0 ? parseFloat(values[carbsIndex]) || 0 : 0,
//         sodium: sodiumIndex >= 0 ? parseFloat(values[sodiumIndex]) || 0 : 0,
//         porpotionSize:
//           portionSizeIndex >= 0
//             ? parseFloat(values[portionSizeIndex]) || 100
//             : 100,
//       };

//       if (food.name && food.name !== "Unknown Food") {
//         foods.push(food);
//       }
//     }

//     return foods;
//   } catch (error) {
//     console.error("Error reading CSV from server:", error);
//     return [];
//   }
// }

// // Helper to find column index from possible column names
// function findColumnIndex(headers: string[], possibleNames: string[]): number {
//   for (const name of possibleNames) {
//     const index = headers.findIndex((h) => h === name);
//     if (index !== -1) return index;
//   }
//   return -1;
// }

// // Server-side function to write to the CSV file - maintaining the same format
// export async function writeCsvToServer(foods: Food[]): Promise<boolean> {
//   try {
//     // Use the original column headers to maintain compatibility
//     const header =
//       "Menu,Energy (kcal),Protein (g),Fat (g),Carbohydrates (g),Sodium (mg),Portion Size (g)\n";

//     // Convert foods to CSV rows
//     const rows = foods
//       .map(
//         (food) =>
//           `${food.name},${food.calories},${food.protein},${food.fat},${food.carbs},${food.sodium},${food.porpotionSize}`
//       )
//       .join("\n");

//     // Combine header and rows
//     const csvContent = header + rows;

//     // Write to file
//     fs.writeFileSync(csvFilePath, csvContent);

//     console.log(`Successfully wrote ${foods.length} foods to CSV`);
//     return true;
//   } catch (error) {
//     console.error("Error writing CSV on server:", error);
//     return false;
//   }
// }

// // Add a new food to the CSV
// export async function addFoodToServer(newFood: Food): Promise<boolean> {
//   try {
//     // Read existing foods
//     const foods = await readCsvFromServer();

//     // Check if food already exists
//     if (foods.some((food) => food.name === newFood.name)) {
//       return false;
//     }

//     // Add new food
//     foods.push(newFood);

//     // Write back to the CSV
//     return writeCsvToServer(foods);
//   } catch (error) {
//     console.error("Error adding food to CSV:", error);
//     return false;
//   }
// }

// // Update a food in the CSV
// export async function updateFoodInServer(
//   id: string,
//   updatedFood: Food
// ): Promise<boolean> {
//   try {
//     // Read existing foods
//     const foods = await readCsvFromServer();

//     // Find food index
//     const index = foods.findIndex((food) => food.name === id);

//     if (index === -1) {
//       return false;
//     }

//     // Update food
//     foods[index] = updatedFood;

//     // Write back to the CSV
//     return writeCsvToServer(foods);
//   } catch (error) {
//     console.error("Error updating food in CSV:", error);
//     return false;
//   }
// }

// // Delete a food from the CSV
// export async function deleteFoodFromServer(id: string): Promise<boolean> {
//   try {
//     // Read existing foods
//     const foods = await readCsvFromServer();

//     // Filter out the food to delete
//     const filteredFoods = foods.filter((food) => food.name !== id);

//     // If no foods were removed, food wasn't found
//     if (filteredFoods.length === foods.length) {
//       return false;
//     }

//     // Write back to the CSV
//     return writeCsvToServer(filteredFoods);
//   } catch (error) {
//     console.error("Error deleting food from CSV:", error);
//     return false;
//   }
// }

import fs from "fs";
import path from "path";

// Define the Food interface locally to match the one in csvReader.ts
interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
}

// Define the CSV file path for server operations
const csvFilePath = path.join(process.cwd(), "public", "foods.csv");

// Helper to find column index from possible column names
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h === name);
    if (index !== -1) return index;
  }
  return -1;
}

// Server-side function to read the CSV directly from the filesystem
export async function readCsvFromServer(): Promise<Food[]> {
  try {
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found at ${csvFilePath}`);
      return [];
    }

    // Read file content
    const data = fs.readFileSync(csvFilePath, "utf-8");

    // Parse CSV headers first to identify column positions
    const lines = data.trim().split("\n");
    if (lines.length === 0) {
      return [];
    }

    const headers = lines[0].split(",");

    // Find column indices based on your flexible naming scheme
    const nameIndex = findColumnIndex(headers, [
      "Menu",
      "menu",
      "Nama Makanan",
    ]);
    const caloriesIndex = findColumnIndex(headers, [
      "Energy (kcal)",
      "energy (kcal)",
    ]);
    const proteinIndex = findColumnIndex(headers, [
      "Protein (g)",
      "protein (g)",
    ]);
    const fatIndex = findColumnIndex(headers, ["Fat (g)", "fat (g)"]);
    const carbsIndex = findColumnIndex(headers, [
      "Carbohydrates (g)",
      "carbohydrates (g)",
    ]);
    const sodiumIndex = findColumnIndex(headers, [
      "Sodium (mg)",
      "sodium (mg)",
    ]);
    const portionSizeIndex = findColumnIndex(headers, [
      "Portion Size (g)",
      "portion size (g)",
      "Portion Size",
    ]);

    // Untuk menghindari duplikat
    const uniqueFoods: Food[] = [];
    const uniqueNames = new Set<string>();

    // Parse the CSV rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",");

      // Map to the same format your application expects
      const food: Food = {
        name:
          nameIndex >= 0
            ? String(values[nameIndex] || "Unknown Food")
            : "Unknown Food",
        calories:
          caloriesIndex >= 0 ? parseFloat(values[caloriesIndex]) || 0 : 0,
        protein: proteinIndex >= 0 ? parseFloat(values[proteinIndex]) || 0 : 0,
        fat: fatIndex >= 0 ? parseFloat(values[fatIndex]) || 0 : 0,
        carbs: carbsIndex >= 0 ? parseFloat(values[carbsIndex]) || 0 : 0,
        sodium: sodiumIndex >= 0 ? parseFloat(values[sodiumIndex]) || 0 : 0,
        porpotionSize:
          portionSizeIndex >= 0
            ? parseFloat(values[portionSizeIndex]) || 100
            : 100,
      };

      // Tambahkan makanan hanya jika namanya ada dan unik
      if (food.name && food.name !== "Unknown Food") {
        if (!uniqueNames.has(food.name)) {
          uniqueNames.add(food.name);
          uniqueFoods.push(food);
        } else {
          console.log(`Makanan duplikat ditemukan dan dilewati: ${food.name}`);
        }
      }
    }

    console.log(`Berhasil membaca ${uniqueFoods.length} makanan dari CSV`);
    return uniqueFoods;
  } catch (error) {
    console.error("Error reading CSV from server:", error);
    return [];
  }
}

// Server-side function to write to the CSV file - maintaining the same format
export async function writeCsvToServer(foods: Food[]): Promise<boolean> {
  try {
    console.log("CSV file path:", csvFilePath);
    console.log("Will write:", foods.length, "items");

    // Use the original column headers to maintain compatibility
    const header =
      "Menu,Energy (kcal),Protein (g),Fat (g),Carbohydrates (g),Sodium (mg),Portion Size (g)\n";

    // Convert foods to CSV rows
    const rows = foods
      .map(
        (food) =>
          `${food.name},${food.calories},${food.protein},${food.fat},${food.carbs},${food.sodium},${food.porpotionSize}`
      )
      .join("\n");

    // Combine header and rows
    const csvContent = header + rows;

    // Write to file
    fs.writeFileSync(csvFilePath, csvContent);

    console.log(`Successfully wrote ${foods.length} foods to CSV`);
    return true;
  } catch (error) {
    console.error("Error writing CSV on server:", error);
    return false;
  }
}

// Add a new food to the CSV
export async function addFoodToServer(newFood: Food): Promise<boolean> {
  try {
    // Read existing foods
    const foods = await readCsvFromServer();

    // Check if food already exists
    if (foods.some((food) => food.name === newFood.name)) {
      return false;
    }

    // Add new food
    foods.push(newFood);

    // Write back to the CSV
    return writeCsvToServer(foods);
  } catch (error) {
    console.error("Error adding food to CSV:", error);
    return false;
  }
}

// Update a food in the CSV
export async function updateFoodInServer(
  id: string,
  updatedFood: Food
): Promise<boolean> {
  try {
    // Read existing foods
    const foods = await readCsvFromServer();

    // Find food index
    const index = foods.findIndex((food) => food.name === id);

    if (index === -1) {
      return false;
    }

    // Update food
    foods[index] = updatedFood;

    // Write back to the CSV
    return writeCsvToServer(foods);
  } catch (error) {
    console.error("Error updating food in CSV:", error);
    return false;
  }
}

// Delete a food from the CSV
export async function deleteFoodFromServer(id: string): Promise<boolean> {
  try {
    console.log(`Menghapus makanan dengan nama: "${id}"`);

    // Periksa apakah file ada
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file tidak ditemukan di ${csvFilePath}`);
      return false;
    }

    // Baca file CSV secara langsung untuk debugging
    const data = fs.readFileSync(csvFilePath, "utf-8");
    console.log(
      "File content sample (first 200 chars):",
      data.substring(0, 200)
    );

    // Baca semua makanan
    const foods = await readCsvFromServer();
    console.log(`Jumlah makanan sebelum penghapusan: ${foods.length}`);

    // Filter makanan yang akan dihapus
    const filteredFoods = foods.filter((food) => {
      const match = food.name !== id;
      if (!match)
        console.log(`Menemukan makanan yang akan dihapus: ${food.name}`);
      return match;
    });

    // Jika tidak ada yang dihapus
    if (filteredFoods.length === foods.length) {
      console.error(
        `Makanan dengan nama '${id}' tidak ditemukan untuk dihapus`
      );
      return false;
    }

    console.log(`Jumlah makanan setelah penghapusan: ${filteredFoods.length}`);

    // Tulis kembali ke CSV
    const result = await writeCsvToServer(filteredFoods);

    return result;
  } catch (error) {
    console.error("Error menghapus makanan dari CSV:", error);
    return false;
  }
}
