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
  kategori: string;
}
export type SelectedFoods = {
  breakfast: FoodUI[];
  lunch: FoodUI[];
  dinner: FoodUI[];
};
// export interface Food {
//   name: string;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   sodium: number;
//   porpotionSize: number; // Note: keeping your original spelling for consistency
// }
// export interface Food {
//   Menu: string;
//   Energy: number;
//   Protein: number;
//   Fat: number;
//   Carbohydrates: number;
//   Sodium: number;
//   Porpotion_Size: number;
//   "Energy (kcal)": number;
//   "Protein (g)": number;
//   "Fat (g)": number;
//   "Carbohydrates (g)": number;
//   "Sodium (mg)": number;
//   "Portion Size (g)": number;
//   name: string;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   sodium: number;
//   porpotionSize: number;
// }
