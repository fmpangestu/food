import { Food } from "@/app/formFood/page";

type MealType = "breakfast" | "lunch" | "dinner";

export function getNewMealRecommendations({
  mealType,
  menuChangeCount,
  setMenuChangeCount,
  recommendedFoods,
  setExcludedCombinations,
  usedFoodNames,
  allExcludedFoods,
  breakfastCalories,
  lunchCalories,
  dinnerCalories,
  getMultipleRecommendations,
  setRecommendedFoods,
}: {
  mealType: MealType;
  menuChangeCount: { breakfast: number; lunch: number; dinner: number };
  setMenuChangeCount: React.Dispatch<
    React.SetStateAction<{ breakfast: number; lunch: number; dinner: number }>
  >;
  recommendedFoods: { breakfast: Food[]; lunch: Food[]; dinner: Food[] };
  setExcludedCombinations: React.Dispatch<
    React.SetStateAction<{
      breakfast: Set<string>;
      lunch: Set<string>;
      dinner: Set<string>;
    }>
  >;
  usedFoodNames: Set<string>;
  allExcludedFoods: React.MutableRefObject<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>;
  breakfastCalories: number | null;
  lunchCalories: number | null;
  dinnerCalories: number | null;
  getMultipleRecommendations: (
    targetCalories: number,
    mealType: MealType,
    excludedFoods: Set<string>,
    count: number,
    maxAttempts: number
  ) => Food[];
  setRecommendedFoods: React.Dispatch<
    React.SetStateAction<{ breakfast: Food[]; lunch: Food[]; dinner: Food[] }>
  >;
}) {
  setMenuChangeCount((prev) => ({
    ...prev,
    [mealType]: prev[mealType] + 1,
  }));

  const currentFoods = recommendedFoods[mealType];

  if (currentFoods && currentFoods.length > 0) {
    const foodSignature = currentFoods
      .map((food) => food.name)
      .sort()
      .join("|");

    setExcludedCombinations((prev) => {
      const newExcluded = new Set(prev[mealType]);
      newExcluded.add(foodSignature);

      if (newExcluded.size > 15) {
        return {
          ...prev,
          [mealType]: new Set([foodSignature]),
        };
      }
      return {
        ...prev,
        [mealType]: newExcluded,
      };
    });

    currentFoods.forEach((food) => {
      usedFoodNames.delete(food.name);
    });
  }

  const excludedFoodsSet = new Set<string>();
  for (const type of ["breakfast", "lunch", "dinner"] as MealType[]) {
    if (type !== mealType) {
      recommendedFoods[type].forEach((food) => excludedFoodsSet.add(food.name));
    }
  }

  const changeThreshold = 10;
  if (menuChangeCount[mealType] > changeThreshold) {
    const clearFactor = Math.min(
      0.9,
      (menuChangeCount[mealType] - changeThreshold) * 0.1
    );
    allExcludedFoods.current[mealType].forEach((food) => {
      if (Math.random() > clearFactor) {
        excludedFoodsSet.add(food);
      }
    });
  } else {
    allExcludedFoods.current[mealType].forEach((food) => {
      excludedFoodsSet.add(food);
    });
  }

  let targetCalories = 0;
  if (mealType === "breakfast") targetCalories = breakfastCalories || 0;
  else if (mealType === "lunch") targetCalories = lunchCalories || 0;
  else targetCalories = dinnerCalories || 0;

  const dynamicMaxAttempts = Math.min(30, 20 + menuChangeCount[mealType]);

  const newRecommendations = getMultipleRecommendations(
    targetCalories,
    mealType,
    excludedFoodsSet,
    3,
    dynamicMaxAttempts
  );

  setRecommendedFoods((prev) => ({
    ...prev,
    [mealType]: newRecommendations,
  }));
}
