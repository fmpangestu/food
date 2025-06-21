import { ObjectId } from "mongodb";

export interface Food {
  _id?: ObjectId | string; // ID dari MongoDB bisa berupa ObjectId atau string
  Menu: string;
  "Energy (kcal)": number;
  "Protein (g)": number;
  "Fat (g)": number;
  "Carbohydrates (g)": number;
  "Sodium (mg)": number;
  "Portion Size (g)": number;
  "Sugar (g)"?: number; // Properti tambahan opsional
}
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
