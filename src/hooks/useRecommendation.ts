// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import { Food, FormData, RecommendationResult } from "@/types";
// import {
//   calculateIdealWeight,
//   calculateCalorieNeeds,
//   calculateMealCalories,
//   calculateDailyNutrientNeeds,
// } from "@/lib/nutrition";
// import { getRecommendationForMeal } from "@/lib/recommendation";

// export function useRecommendation() {
//   const [formData, setFormData] = useState<FormData>({
//     weight: "",
//     height: "",
//     age: "",
//     gender: "male",
//     activityLevel: "sedentary",
//   });
//   const [allFoods, setAllFoods] = useState<Food[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<RecommendationResult | null>(null);
//   const [recommendedFoods, setRecommendedFoods] = useState<{
//     breakfast: Food[];
//     lunch: Food[];
//     dinner: Food[];
//   }>({ breakfast: [], lunch: [], dinner: [] });
//   const [excludedCombinations, setExcludedCombinations] = useState<{
//     breakfast: Set<string>;
//     lunch: Set<string>;
//     dinner: Set<string>;
//   }>({ breakfast: new Set(), lunch: new Set(), dinner: new Set() });

//   useEffect(() => {
//     const fetchFoods = async () => {
//       try {
//         const response = await fetch("/api/fods");
//         if (!response.ok) throw new Error("Gagal mengambil data makanan");
//         const dataFromMongo = await response.json();
//         if (Array.isArray(dataFromMongo)) {
//           const typedData: Food[] = dataFromMongo.map((item: any) => ({
//             name: item.Menu,
//             calories: Number(item["Energy (kcal)"]),
//             protein: Number(item["Protein (g)"]),
//             fat: Number(item["Fat (g)"]),
//             carbs: Number(item["Carbohydrates (g)"]),
//             sodium: Number(item["Sodium (mg)"]),
//             porpotionSize: Number(item["Portion Size (g)"] || 100),
//           }));
//           setAllFoods(typedData);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchFoods();
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const generateAllRecommendations = (
//     calorieNeedsValue: number,
//     weightNum: number,
//     ageNum: number,
//     gender: string
//   ) => {
//     const idealWeightRange = calculateIdealWeight(parseFloat(formData.height));
//     const mealCals = calculateMealCalories(calorieNeedsValue);
//     const dailyNeeds = calculateDailyNutrientNeeds(
//       calorieNeedsValue,
//       weightNum,
//       ageNum,
//       gender
//     );
//     const usedForThisSession = new Set<string>();

//     const breakfast = getRecommendationForMeal(
//       allFoods,
//       usedForThisSession,
//       excludedCombinations.breakfast,
//       mealCals.breakfastCalories,
//       dailyNeeds,
//       3,
//       "breakfast"
//     );
//     breakfast.forEach((f) => usedForThisSession.add(f.name));

//     const lunch = getRecommendationForMeal(
//       allFoods,
//       usedForThisSession,
//       excludedCombinations.lunch,
//       mealCals.lunchCalories,
//       dailyNeeds,
//       3,
//       "lunch"
//     );
//     lunch.forEach((f) => usedForThisSession.add(f.name));

//     const dinner = getRecommendationForMeal(
//       allFoods,
//       usedForThisSession,
//       excludedCombinations.dinner,
//       mealCals.dinnerCalories,
//       dailyNeeds,
//       3,
//       "dinner"
//     );

//     setRecommendedFoods({ breakfast, lunch, dinner });
//     setResult({
//       ...mealCals,
//       ...dailyNeeds,
//       idealWeight: idealWeightRange,
//       calorieNeeds: calorieNeedsValue,
//       statusMessage: "",
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (allFoods.length === 0) {
//       alert("Data makanan belum termuat, silakan coba sesaat lagi.");
//       return;
//     }
//     setIsLoading(true);
//     const weightNum = parseFloat(formData.weight);
//     const heightNum = parseFloat(formData.height);
//     const ageNum = parseInt(formData.age, 10);
//     const calorieNeedsValue = calculateCalorieNeeds(
//       weightNum,
//       heightNum,
//       ageNum,
//       formData.gender,
//       formData.activityLevel as "sedentary" | "light" | "moderate" | "active"
//     );

//     excludedCombinations.breakfast.clear();
//     excludedCombinations.lunch.clear();
//     excludedCombinations.dinner.clear();

//     generateAllRecommendations(
//       calorieNeedsValue,
//       weightNum,
//       ageNum,
//       formData.gender
//     );
//     setIsLoading(false);
//   };

//   const getNewMealRecommendations = (
//     mealType: "breakfast" | "lunch" | "dinner"
//   ) => {
//     if (!result) return;

//     const currentSignature = recommendedFoods[mealType]
//       .map((f) => f.name)
//       .sort()
//       .join("|");
//     const newExcluded = excludedCombinations[mealType];
//     newExcluded.add(currentSignature);
//     setExcludedCombinations((prev) => ({ ...prev, [mealType]: newExcluded }));

//     const usedInOtherMeals = new Set<string>();
//     if (mealType !== "breakfast")
//       recommendedFoods.breakfast.forEach((f) => usedInOtherMeals.add(f.name));
//     if (mealType !== "lunch")
//       recommendedFoods.lunch.forEach((f) => usedInOtherMeals.add(f.name));
//     if (mealType !== "dinner")
//       recommendedFoods.dinner.forEach((f) => usedInOtherMeals.add(f.name));

//     const newRecommendation = getRecommendationForMeal(
//       allFoods,
//       usedInOtherMeals,
//       newExcluded,
//       result[`${mealType}Calories`],
//       result,
//       3,
//       mealType
//     );

//     setRecommendedFoods((prev) => ({
//       ...prev,
//       [mealType]: newRecommendation,
//     }));
//   };

//   return {
//     formData,
//     isLoading,
//     result,
//     recommendedFoods,
//     handleInputChange,
//     handleSubmit,
//     getNewMealRecommendations,
//   };
// }
// export type { FormData, RecommendationResult, Food };
