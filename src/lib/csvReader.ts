/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from "papaparse";

// Define the output type that your application expects
interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
}

// Define the CSV structure type (as it appears in your CSV file)
interface CSVFoodData {
  [key: string]: any; // Allow any column names from CSV
  Menu?: string;
  "Energy (kcal)"?: number | string;
  "Protein (g)"?: number | string;
  "Fat (g)"?: number | string;
  "Carbohydrates (g)"?: number | string;
  "Sodium (mg)"?: number | string;
  "Portion Size (g)"?: number | string;
}

export const readCSV = async (filePath: string): Promise<Food[]> => {
  try {
    console.log("Fetching CSV from:", filePath);
    const response = await fetch(filePath);

    if (!response.ok) {
      console.error(
        `Failed to fetch CSV: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const text = await response.text();
    console.log("CSV text sample:", text.substring(0, 100)); // Show beginning of CSV

    // Use PapaParse with type assertion to avoid TypeScript errors
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Auto-convert numeric values
    }) as {
      data: CSVFoodData[];
      errors: any[];
      meta: {
        fields: string[];
      };
    };

    console.log("Parsed CSV headers:", result.meta.fields);

    if (result.data.length > 0) {
      const firstRow = result.data[0];
      console.log("First row:", firstRow);
      console.log("First row keys:", Object.keys(firstRow));

      // Check if our expected columns exist
      console.log("Menu column exists?", "Menu" in firstRow);
      console.log("Energy (kcal) column exists?", "Energy (kcal)" in firstRow);
    }

    // Map CSV data to our application's Food interface
    return result.data.map(
      (entry): Food => ({
        name: String(
          entry.Menu ||
            entry["Menu"] ||
            entry.menu ||
            entry["Nama Makanan"] ||
            "Unknown Food"
        ),
        calories:
          Number(entry["Energy (kcal)"]) || Number(entry["energy (kcal)"]) || 0,
        protein:
          Number(entry["Protein (g)"]) || Number(entry["protein (g)"]) || 0,
        fat: Number(entry["Fat (g)"]) || Number(entry["fat (g)"]) || 0,
        carbs:
          Number(entry["Carbohydrates (g)"]) ||
          Number(entry["carbohydrates (g)"]) ||
          0,
        sodium:
          Number(entry["Sodium (mg)"]) || Number(entry["sodium (mg)"]) || 0,
        porpotionSize:
          Number(entry["Portion Size (g)"]) ||
          Number(entry["portion size (g)"]) ||
          Number(entry["Portion Size"]) ||
          100,
      })
    );
  } catch (error) {
    console.error("Error reading CSV:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
};
