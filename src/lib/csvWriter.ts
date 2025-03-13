import fs from "fs";
import path from "path";
import { Food } from "../types/food";

// Define the path to your CSV file
const csvFilePath = path.join(process.cwd(), "public", "foods.csv");

export async function writeCSV(foods: Food[]): Promise<boolean> {
  try {
    // Create header row
    const header = "name,calories,protein,fat,carbs,sodium,porpotionSize\n";

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
    return true;
  } catch (error) {
    console.error("Error writing CSV:", error);
    return false;
  }
}

// Helper function to add a new food
export async function addFood(newFood: Food): Promise<boolean> {
  try {
    // Read existing foods
    const { readCSV } = await import("./csvReader");
    const foods = await readCSV("/foods.csv");

    // Check if food with same name already exists
    if (foods.some((food) => food.name === newFood.name)) {
      return false;
    }

    // Add new food and write back to CSV
    foods.push(newFood);
    return writeCSV(foods);
  } catch (error) {
    console.error("Error adding food:", error);
    return false;
  }
}

// Helper function to update an existing food
export async function updateFood(
  id: string,
  updatedFood: Food
): Promise<boolean> {
  try {
    // Read existing foods
    const { readCSV } = await import("./csvReader");
    const foods = await readCSV("/foods.csv");

    // Find food index by name
    const index = foods.findIndex((food) => food.name === id);
    if (index === -1) return false;

    // Update food and write back to CSV
    foods[index] = updatedFood;
    return writeCSV(foods);
  } catch (error) {
    console.error("Error updating food:", error);
    return false;
  }
}

// Helper function to delete a food
export async function deleteFood(id: string): Promise<boolean> {
  try {
    // Read existing foods
    const { readCSV } = await import("./csvReader");
    const foods = await readCSV("/foods.csv");

    // Filter out the food to delete
    const newFoods = foods.filter((food) => food.name !== id);

    // If length is the same, no food was found with that name
    if (newFoods.length === foods.length) return false;

    // Write back to CSV
    return writeCSV(newFoods);
  } catch (error) {
    console.error("Error deleting food:", error);
    return false;
  }
}
