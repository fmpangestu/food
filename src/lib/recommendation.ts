// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Food } from "@/types";
// import cosineSimilarity from "@/lib/cosineSimilarity";

// // Fungsi ini sekarang murni, menerima semua yang ia butuhkan sebagai argumen
// export const getRecommendationForMeal = (
//   allFoods: Food[],
//   usedFoodNames: Set<string>,
//   excludedCombinations: Set<string>, // Parameter baru
//   targetCalories: number,
//   dailyNeeds: any,
//   count: number = 3,
//   mealType: string // Ditambahkan untuk penyesuaian
// ): Food[] => {
//   let availableFoods = allFoods.filter((food) => !usedFoodNames.has(food.name));

//   if (availableFoods.length < count) {
//     console.warn("Tidak cukup makanan tersedia untuk rekomendasi.");
//     // Jika benar-benar habis, coba reset dan pakai lagi
//     if (allFoods.length >= count) {
//       availableFoods = allFoods;
//     } else {
//       return [];
//     }
//   }

//   const perFoodTarget = targetCalories / count;
//   const mealProteinRatio =
//     mealType === "lunch" ? 0.4 : mealType === "dinner" ? 0.35 : 0.25;
//   const mealCarbRatio =
//     mealType === "lunch" ? 0.4 : mealType === "dinner" ? 0.35 : 0.25;

//   const targetProfile = {
//     calories: perFoodTarget,
//     protein: (dailyNeeds.dailyProteinNeeds * mealProteinRatio) / count,
//     carbs: (dailyNeeds.dailyCarbsNeeds * mealCarbRatio) / count,
//     fat: (targetCalories * 0.3) / 9 / count,
//   };

//   const foodsWithScores = availableFoods.map((food) => {
//     const foodVector = [food.calories, food.protein, food.carbs, food.fat];
//     const targetVector = [
//       targetProfile.calories,
//       targetProfile.protein,
//       targetProfile.carbs,
//       targetProfile.fat,
//     ];
//     const similarityScore = cosineSimilarity(foodVector, targetVector);
//     return { ...food, similarityScore };
//   });

//   const sortedFoods = foodsWithScores.sort(
//     (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0)
//   );

//   // Cari kombinasi unik
//   for (let i = 0; i <= sortedFoods.length - count; i++) {
//     const combination = [];
//     const tempUsed = new Set<string>();

//     for (let j = 0; j < sortedFoods.length && combination.length < count; j++) {
//       const food = sortedFoods[j];
//       if (!tempUsed.has(food.name)) {
//         combination.push(food);
//         tempUsed.add(food.name);
//       }
//     }

//     if (combination.length === count) {
//       const signature = combination
//         .map((f) => f.name)
//         .sort()
//         .join("|");
//       if (!excludedCombinations.has(signature)) {
//         return combination; // Kembalikan kombinasi valid pertama yang ditemukan
//       }
//     }
//   }

//   // Fallback jika semua kombinasi sudah pernah muncul, kembalikan saja yang teratas
//   return sortedFoods.slice(0, count);
// };
