// export const calculateIdealWeight = (height: number): string => {
//   const minBMI = 18.5;
//   const maxBMI = 24.9;
//   const heightInMeters = height / 100;
//   const minWeight = minBMI * heightInMeters * heightInMeters;
//   const maxWeight = maxBMI * heightInMeters * heightInMeters;
//   return `${Math.round(minWeight)} - ${Math.round(maxWeight)} kg`;
// };

// export const calculateCalorieNeeds = (
//   weight: number,
//   height: number,
//   age: number,
//   gender: string,
//   activityLevel: "sedentary" | "light" | "moderate" | "active"
// ): number => {
//   const bmr =
//     gender === "male"
//       ? 10 * weight + 6.25 * height - 5 * age + 5
//       : 10 * weight + 6.25 * height - 5 * age - 161;
//   const activityFactors = {
//     sedentary: 1.2,
//     light: 1.375,
//     moderate: 1.55,
//     active: 1.725,
//   };
//   return Math.round(bmr * (activityFactors[activityLevel] || 1.2));
// };

// export const calculateDailyNutrientNeeds = (
//   calories: number,
//   weight: number,
//   age: number,
//   gender: string
// ) => {
//   const proteinNeeds = Math.round(weight * 0.8);
//   const sugarNeeds = Math.round(Math.min((calories * 0.1) / 4, 50));
//   const carbsNeeds = Math.round((calories * 0.55) / 4);
//   let sodiumNeeds: number;
//   if (age < 1) sodiumNeeds = 1;
//   else if (age <= 3) sodiumNeeds = 2;
//   else if (age <= 6) sodiumNeeds = 3;
//   else if (age <= 10) sodiumNeeds = 5;
//   else sodiumNeeds = 6;
//   const saturedFatLimit = gender === "male" ? 30 : 20;
//   return {
//     dailyProteinNeeds: proteinNeeds,
//     dailySugarNeeds: sugarNeeds,
//     dailyCarbsNeeds: carbsNeeds,
//     dailySodiumNeeds: sodiumNeeds,
//     saturedFatLimit,
//   };
// };

// export const calculateMealCalories = (totalCalories: number) => {
//   const breakfastCalories = Math.round(totalCalories * 0.25);
//   const lunchCalories = Math.round(totalCalories * 0.5);
//   const dinnerCalories = Math.round(totalCalories * 0.25);
//   return { breakfastCalories, lunchCalories, dinnerCalories };
// };
