// // FILE: components/recommendation/MealCard.tsx

// "use client";

// // Definisikan tipe Food di sini atau impor dari file types terpusat
// interface Food {
//   name: string;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   sugar?: number;
//   sodium: number;
//   porpotionSize: number;
//   similarityScore?: number;
// }

// interface MealCardProps {
//   mealType: "breakfast" | "lunch" | "dinner";
//   foods: Food[];
//   targetCalories: number | null;
//   onGantiMenu: (mealType: "breakfast" | "lunch" | "dinner") => void;
// }

// const mealTitles = {
//   breakfast: "Sarapan",
//   lunch: "Makan Siang",
//   dinner: "Makan Malam",
// };

// export default function MealCard({
//   mealType,
//   foods,
//   targetCalories,
//   onGantiMenu,
// }: MealCardProps) {
//   if (!foods || foods.length === 0) {
//     return (
//       <div className="mt-2 p-4 bg-yellow-100 text-amber-800 rounded-lg">
//         <p>Tidak ada rekomendasi yang tersedia untuk saat ini.</p>
//       </div>
//     );
//   }

//   const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
//   const caloriePercentage = targetCalories
//     ? Math.round((totalCalories / targetCalories) * 100)
//     : 0;

//   return (
//     <div className="mt-2 bg-white rounded-lg p-4">
//       <div className="flex justify-between items-center border-b border-[#00712D]/30 pb-2 mb-3">
//         <h2 className="font-semibold text-sm lg:text-lg text-sky-500">
//           {mealTitles[mealType]}
//         </h2>
//         <button
//           onClick={() => onGantiMenu(mealType)}
//           className="bg-gradient-to-r from-sky-800 to-blue-600 text-white py-1 px-4 text-[10px] lg:text-sm rounded-full font-medium"
//         >
//           Ganti Rekomendasi
//         </button>
//       </div>

//       <div className="space-y-3">
//         {foods.map((food, index) => (
//           <div
//             key={index}
//             className="p-3 bg-gradient-to-r from-sky-800 to-blue-600 rounded-lg"
//           >
//             <div className="font-bold mb-1 text-white">{food.name}</div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Kalori:</span> {food.calories}{" "}
//               kcal
//             </div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Protein:</span> {food.protein} g
//             </div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Lemak:</span> {food.fat} g
//             </div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Karbohidrat:</span> {food.carbs} g
//             </div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Sodium:</span> {food.sodium} mg
//             </div>
//             <div className="text-white text-sm">
//               <span className="font-semibold">Porsi:</span>{" "}
//               {food.porpotionSize || 100}g
//             </div>
//           </div>
//         ))}
//         <div className="mb-4 pt-2">
//           <div className="flex items-center justify-between mb-1 text-sky-700">
//             <span className="font-semibold">Total Kalori:</span>
//             <span>
//               {totalCalories} kcal ({caloriePercentage}% dari target)
//             </span>
//           </div>
//           <div className="bg-gray-200 rounded-full h-2">
//             <div
//               className={`h-2 rounded-full ${
//                 caloriePercentage <= 80
//                   ? "bg-green-600"
//                   : caloriePercentage <= 110
//                   ? "bg-blue-600"
//                   : "bg-red-500"
//               }`}
//               style={{ width: `${Math.min(caloriePercentage, 150)}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
