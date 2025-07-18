export function calculateMealCalories(totalCalories: number) {
  const breakfastCalories = Math.round(totalCalories * 0.25);
  const lunchCalories = Math.round(totalCalories * 0.375);
  const dinnerCalories = Math.round(totalCalories * 0.375);
  return { breakfastCalories, lunchCalories, dinnerCalories };
}
