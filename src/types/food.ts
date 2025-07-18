import { ObjectId } from "mongodb";

// types/food.ts
export interface Food {
  _id?: ObjectId | string;
  Menu: string;
  "Energy (kcal)": number;
  "Protein (g)": number;
  "Fat (g)": number;
  "Carbohydrates (g)": number;
  "Sodium (mg)": number;
  "Portion Size (g)": number;
  "Sugar (g)"?: number;
  kategori?: string; // <-- tambah ini
}

// Bisa di file types/food-ui.ts
export interface FoodUI {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
  similarityScore?: number;
  sugar?: number;
  kategori: string;
}
export type SelectedFoods = {
  breakfast: FoodUI[];
  lunch: FoodUI[];
  dinner: FoodUI[];
};
