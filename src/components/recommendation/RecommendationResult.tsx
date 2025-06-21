// "use client";
// import type { RecommendationResult } from "@/types";
// import { Food } from "@/types";
// import MealCard from "./MealCard";

// interface RecommendationResultProps {
//   result: RecommendationResult;
//   recommendedFoods: { breakfast: Food[]; lunch: Food[]; dinner: Food[] };
//   getNewMealRecommendations: (
//     mealType: "breakfast" | "lunch" | "dinner"
//   ) => void;
// }

// export default function RecommendationResult({
//   result,
//   recommendedFoods,
//   getNewMealRecommendations,
// }: RecommendationResultProps) {
//   return (
//     <div className="md:container mx-2 md:mx-auto my-5 p-4 sm:p-6 bg-gray-50 rounded-xl">
//       <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
//         Hasil Analisis Anda
//       </h2>

//       <div className="p-4 bg-white rounded-lg shadow-sm space-y-2 text-gray-700">
//         <p>
//           <strong>Status:</strong>{" "}
//           {result.statusMessage || "Jaga pola makan Anda."}
//         </p>
//         <p>
//           <strong>Berat Badan Ideal:</strong> {result.idealWeight}
//         </p>
//         <p>
//           <strong>Kebutuhan Kalori Harian:</strong> {result.calorieNeeds} kcal
//         </p>
//         {/* Tambahkan detail nutrisi lain jika perlu */}
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//         <MealCard
//           mealType="breakfast"
//           foods={recommendedFoods.breakfast}
//           targetCalories={result.breakfastCalories}
//           onGantiMenu={getNewMealRecommendations}
//         />
//         <MealCard
//           mealType="lunch"
//           foods={recommendedFoods.lunch}
//           targetCalories={result.lunchCalories}
//           onGantiMenu={getNewMealRecommendations}
//         />
//         <MealCard
//           mealType="dinner"
//           foods={recommendedFoods.dinner}
//           targetCalories={result.dinnerCalories}
//           onGantiMenu={getNewMealRecommendations}
//         />
//       </div>
//     </div>
//   );
// }
