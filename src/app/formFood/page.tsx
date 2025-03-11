"use client";
import { useEffect, useState, useRef } from "react";
import { readCSV } from "../../lib/csvReader";
import cosineSimilarity from "../../lib/cosineSimilarity";

// Tipe untuk data form
interface FormData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
}

// Tipe untuk hasil makanan
interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
  similarityScore?: number;
}

const FoodRecommendation = () => {
  const [formData, setFormData] = useState<FormData>({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "sedentary",
  });
  const [foods, setFoods] = useState<Food[]>([]);

  // Update state to store arrays of foods per meal
  const [recommendedFoods, setRecommendedFoods] = useState<{
    breakfast: Food[];
    lunch: Food[];
    dinner: Food[];
  }>({ breakfast: [], lunch: [], dinner: [] });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [idealWeight, setIdealWeight] = useState<string | null>(null);
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);
  const [dailySugarNeeds, setDailySugarNeeds] = useState<number | null>(null);
  const [dailySodiumNeeds, setDailySodiumNeeds] = useState<number | null>(null);
  const [dailyProteinNeeds, setDailyProteinNeeds] = useState<number | null>(
    null
  );
  const [dailyCarbsNeeds, setDailyCarbsNeeds] = useState<number | null>(null);
  const [saturedFatLimit, setSaturedFatLimit] = useState<number | null>(null);
  const [breakfastCalories, setBreakfastCalories] = useState<number | null>(
    null
  );
  const [lunchCalories, setLunchCalories] = useState<number | null>(null);
  const [dinnerCalories, setDinnerCalories] = useState<number | null>(null);
  const [menuChangeCount, setMenuChangeCount] = useState<{
    breakfast: number;
    lunch: number;
    dinner: number;
  }>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  const allExcludedFoods = useRef<{
    [key: string]: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });
  // Update to track excluded food combinations
  const [excludedCombinations, setExcludedCombinations] = useState<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });

  // useEffect(() => {
  //   const fetchFoods = async () => {
  //     const data = await readCSV("/foods.csv");
  //     if (!data || data.length === 0) {
  //       console.error("No foods loaded or empty data array");
  //     } else {
  //       console.log("Loaded foods sample:", data.slice(0, 3));
  //     }
  //     setFoods(data);
  //   };
  //   fetchFoods();
  // }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const rawData = await readCSV("/foods.csv");

        // Type check and transform the data if needed
        if (Array.isArray(rawData)) {
          // Map the data to ensure correct property names
          const typedData: Food[] = rawData.map((item) => ({
            name: item.name,
            calories: Number(item.calories),
            protein: Number(item.protein),
            fat: Number(item.fat),
            carbs: Number(item.carbs),
            sodium: Number(item.sodium),
            porpotionSize: Number(
              item.porpotionSize || item.porpotionSize || 100
            ), // Handle both spellings
            similarityScore: undefined,
          }));

          if (!typedData || typedData.length === 0) {
            console.error("No foods loaded or empty data array");
          } else {
            console.log("Loaded foods sample:", typedData.slice(0, 3));
          }

          setFoods(typedData);
        } else {
          console.error("Invalid data format returned from readCSV");
        }
      } catch (error) {
        console.error("Error loading food data:", error);
      }
    };

    fetchFoods();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const { weight, height, age } = formData;
    if (
      !weight ||
      !height ||
      !age ||
      Number(weight) <= 0 ||
      Number(height) <= 0 ||
      Number(age) <= 0
    ) {
      setError("Semua input harus diisi dengan nilai yang valid.");
      setSuccess(null);
      return false;
    }
    setError(null);
    return true;
  };

  const calculateIdealWeight = (height: number) => {
    const minBMI = 18.5;
    const maxBMI = 24.9;
    const heightInMeters = height / 100;
    const minWeight = minBMI * heightInMeters * heightInMeters;
    const maxWeight = maxBMI * heightInMeters * heightInMeters;
    return `${Math.round(minWeight)} - ${Math.round(maxWeight)} kg`;
  };

  const calculateCalorieNeeds = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    activityLevel: string
  ): number => {
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    return Math.round(bmr * (activityFactors[activityLevel] || 1.2));
  };

  const calculateDailyNutrientNeeds = (
    calories: number,
    weight: number,
    age: number,
    gender: string
  ) => {
    const proteinNeeds = Math.round(weight * 0.8);
    const sugarNeeds = Math.min((calories * 0.1) / 4, 50);
    setDailySugarNeeds(sugarNeeds);
    let sodiumNeeds: number;
    if (age < 1) {
      sodiumNeeds = 1;
    } else if (age <= 3) {
      sodiumNeeds = 2;
    } else if (age <= 6) {
      sodiumNeeds = 3;
    } else if (age <= 10) {
      sodiumNeeds = 5;
    } else {
      sodiumNeeds = 6;
    }
    const saturedFatLimit = gender === "male" ? 30 : 20;
    const carbsNeeds = Math.round(calories * 0.55) / 4;
    setDailySodiumNeeds(sodiumNeeds);
    setDailyProteinNeeds(proteinNeeds);
    setDailyCarbsNeeds(carbsNeeds);
    setSaturedFatLimit(saturedFatLimit);
  };

  // Global set to track used food names across all meals
  const usedFoodNames = new Set<string>();

  // New function to get multiple food recommendations for a meal
  // const getMultipleRecommendations = (
  //   targetCalories: number,
  //   mealType: "breakfast" | "lunch" | "dinner",
  //   excludedFoods: Set<string> = new Set(),
  //   count: number = 3
  // ): Food[] => {
  //   // Set calorie constraints based on meal type for individual foods
  //   const perFoodTarget = targetCalories / count;

  //   let minCaloriesPerFood, maxCaloriesPerFood;
  //   if (mealType === "breakfast") {
  //     minCaloriesPerFood = perFoodTarget * 0.5; // More flexible for individual items
  //     maxCaloriesPerFood = perFoodTarget * 1.5;
  //   } else if (mealType === "dinner") {
  //     minCaloriesPerFood = perFoodTarget * 0.6;
  //     maxCaloriesPerFood = perFoodTarget * 1.4;
  //   } else {
  //     minCaloriesPerFood = perFoodTarget * 0.7;
  //     maxCaloriesPerFood = perFoodTarget * 1.3;
  //   }

  //   console.log(
  //     `${mealType} total target: ${targetCalories}, per item: ${perFoodTarget}`
  //   );

  //   // Filter foods by calorie range and exclude already used foods
  //   let availableFoods = foods.filter(
  //     (food) =>
  //       food.calories >= minCaloriesPerFood &&
  //       food.calories <= maxCaloriesPerFood &&
  //       !usedFoodNames.has(food.name) &&
  //       !excludedFoods.has(food.name)
  //   );

  //   // If not enough foods in range, expand range
  //   if (availableFoods.length < count * 2) {
  //     console.log(`Not enough foods in range for ${mealType}, expanding range`);
  //     availableFoods = foods.filter(
  //       (food) => !usedFoodNames.has(food.name) && !excludedFoods.has(food.name)
  //     );
  //   }

  //   // If still not enough foods, allow previously excluded foods
  //   if (availableFoods.length < count) {
  //     console.log(`Not enough foods for ${mealType}, allowing excluded foods`);
  //     availableFoods = foods.filter((food) => !usedFoodNames.has(food.name));
  //   }

  //   // Create target "profile" for similarity calculation
  //   const targetProfile = {
  //     calories: perFoodTarget, // Target per item
  //     protein: dailyProteinNeeds
  //       ? (dailyProteinNeeds * (mealType === "lunch" ? 0.5 : 0.25)) / count
  //       : 0,
  //     carbs: dailyCarbsNeeds
  //       ? (dailyCarbsNeeds * (mealType === "lunch" ? 0.5 : 0.25)) / count
  //       : 0,
  //     fat: (targetCalories * 0.3) / 9 / count,
  //   };

  //   // Calculate similarity scores
  //   const foodsWithScores = availableFoods.map((food) => {
  //     const foodVector = [food.calories, food.protein, food.carbs, food.fat];
  //     const targetVector = [
  //       targetProfile.calories,
  //       targetProfile.protein,
  //       targetProfile.carbs,
  //       targetProfile.fat,
  //     ];

  //     // Calculate similarity with specific focus on calories matching
  //     let calorieMatch =
  //       1 - Math.abs(food.calories - perFoodTarget) / perFoodTarget;

  //     // Add penalty for exceeding target calories, especially for breakfast
  //     if (food.calories > perFoodTarget) {
  //       const overagePercent = (food.calories - perFoodTarget) / perFoodTarget;

  //       // Breakfast should have heavier penalty for being over
  //       if (mealType === "breakfast") {
  //         calorieMatch -= overagePercent * 0.5; // Higher penalty for breakfast
  //       } else {
  //         calorieMatch -= overagePercent * 0.3; // Normal penalty for lunch/dinner
  //       }
  //     }

  //     const similarityScore =
  //       cosineSimilarity(foodVector, targetVector) * (0.7 + 0.3 * calorieMatch);

  //     return { ...food, similarityScore };
  //   });

  //   // Sort by similarity score
  //   const sortedFoods = foodsWithScores.sort(
  //     (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0)
  //   );

  //   // Get the top 'count' recommendations
  //   // const selectedFoods: Food[] = [];
  //   // for (let i = 0; i < sortedFoods.length && selectedFoods.length < count; i++) {
  //   //   const food = sortedFoods[i];
  //   //   // Only add if not already in the set
  //   //   if (!usedFoodNames.has(food.name)) {
  //   //     selectedFoods.push(food);
  //   //     usedFoodNames.add(food.name);
  //   //   }
  //   // }

  //   const selectedFoods: Food[] = [];
  //   let attempts = 0;
  //   const maxAttempts = 5; // Avoid infinite loops

  //   while (selectedFoods.length < count && attempts < maxAttempts) {
  //     attempts++;

  //     // Clear previous selection attempt
  //     selectedFoods.length = 0;
  //     const tempUsedNames = new Set<string>();

  //     for (
  //       let i = 0;
  //       i < sortedFoods.length && selectedFoods.length < count;
  //       i++
  //     ) {
  //       const food = sortedFoods[i];
  //       // Only add if not already in the temporary set
  //       if (
  //         !tempUsedNames.has(food.name) &&
  //         !usedFoodNames.has(food.name) &&
  //         !excludedFoods.has(food.name)
  //       ) {
  //         selectedFoods.push(food);
  //         tempUsedNames.add(food.name);
  //       }
  //     }

  //     // Check if this combination is in excluded combinations
  //     if (selectedFoods.length === count) {
  //       const foodSignature = selectedFoods
  //         .map((food) => food.name)
  //         .sort()
  //         .join("|");
  //       if (excludedCombinations[mealType].has(foodSignature)) {
  //         console.log(`Skipping already seen combination for ${mealType}`);
  //         // Try again with the top items excluded
  //         selectedFoods.forEach((food) => excludedFoods.add(food.name));
  //         continue;
  //       }

  //       // Valid new combination - add to used foods
  //       selectedFoods.forEach((food) => usedFoodNames.add(food.name));
  //       break;
  //     }
  //   }

  //   return selectedFoods;
  // };

  const getMultipleRecommendations = (
    targetCalories: number,
    mealType: "breakfast" | "lunch" | "dinner",
    excludedFoods: Set<string> = new Set(),
    count: number = 3,
    maxAttempts: number = 20
  ): Food[] => {
    // Set calorie constraints based on meal type for individual foods
    const perFoodTarget = targetCalories / count;

    let minCaloriesPerFood, maxCaloriesPerFood;
    if (mealType === "breakfast") {
      minCaloriesPerFood = perFoodTarget * 0.5;
      maxCaloriesPerFood = perFoodTarget * 1.5;
    } else if (mealType === "dinner") {
      minCaloriesPerFood = perFoodTarget * 0.6;
      maxCaloriesPerFood = perFoodTarget * 1.4;
    } else {
      minCaloriesPerFood = perFoodTarget * 0.7;
      maxCaloriesPerFood = perFoodTarget * 1.3;
    }

    // Filter foods by calorie range and exclude already used foods
    let availableFoods = foods.filter(
      (food) =>
        food.calories >= minCaloriesPerFood &&
        food.calories <= maxCaloriesPerFood &&
        !usedFoodNames.has(food.name) &&
        !excludedFoods.has(food.name)
    );

    // If not enough foods in range, expand range
    if (availableFoods.length < count * 2) {
      console.log(`${mealType}: Not enough foods in range, expanding range`);
      availableFoods = foods.filter(
        (food) => !usedFoodNames.has(food.name) && !excludedFoods.has(food.name)
      );
    }

    // If still not enough foods, relax exclusion of foods from this meal type
    if (availableFoods.length < count) {
      console.log(`${mealType}: Not enough foods, relaxing some exclusions`);

      // Only consider foods used in other meal types as excluded
      const otherMealTypes = ["breakfast", "lunch", "dinner"].filter(
        (type) => type !== mealType
      );

      const otherMealFoods = new Set<string>();
      otherMealTypes.forEach((type) => {
        recommendedFoods[type as "breakfast" | "lunch" | "dinner"].forEach(
          (food) => otherMealFoods.add(food.name)
        );
      });

      availableFoods = foods.filter((food) => !otherMealFoods.has(food.name));
    }

    // Create target "profile" for similarity calculation
    const targetProfile = {
      calories: perFoodTarget,
      protein: dailyProteinNeeds
        ? (dailyProteinNeeds * (mealType === "lunch" ? 0.5 : 0.25)) / count
        : 0,
      carbs: dailyCarbsNeeds
        ? (dailyCarbsNeeds * (mealType === "lunch" ? 0.5 : 0.25)) / count
        : 0,
      fat: (targetCalories * 0.3) / 9 / count,
    };

    // Calculate similarity scores
    const foodsWithScores = availableFoods.map((food) => {
      const foodVector = [food.calories, food.protein, food.carbs, food.fat];
      const targetVector = [
        targetProfile.calories,
        targetProfile.protein,
        targetProfile.carbs,
        targetProfile.fat,
      ];

      // Calculate similarity with specific focus on calories matching
      let calorieMatch =
        1 - Math.abs(food.calories - perFoodTarget) / perFoodTarget;

      // Add penalty for exceeding target calories, especially for breakfast
      if (food.calories > perFoodTarget) {
        const overagePercent = (food.calories - perFoodTarget) / perFoodTarget;
        if (mealType === "breakfast") {
          calorieMatch -= overagePercent * 0.5;
        } else {
          calorieMatch -= overagePercent * 0.3;
        }
      }

      const similarityScore =
        cosineSimilarity(foodVector, targetVector) * (0.7 + 0.3 * calorieMatch);

      return { ...food, similarityScore };
    });

    // Sort by similarity score
    const sortedFoods = foodsWithScores.sort(
      (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0)
    );

    const selectedFoods: Food[] = [];
    let attempts = 0;

    while (selectedFoods.length < count && attempts < maxAttempts) {
      attempts++;

      // Clear previous selection attempt
      selectedFoods.length = 0;
      const tempUsedNames = new Set<string>();

      // Try to find foods for this combination
      for (
        let i = 0;
        i < sortedFoods.length && selectedFoods.length < count;
        i++
      ) {
        const food = sortedFoods[i];
        // Only add if not already in the temporary set
        if (
          !tempUsedNames.has(food.name) &&
          !usedFoodNames.has(food.name) &&
          !excludedFoods.has(food.name)
        ) {
          selectedFoods.push(food);
          tempUsedNames.add(food.name);
        }
      }

      // If we don't have enough foods but are on later attempts, relax constraints
      if (selectedFoods.length < count && attempts > maxAttempts / 2) {
        // Add any foods that fit calorie range and aren't used in THIS selection
        for (let i = 0; i < foods.length && selectedFoods.length < count; i++) {
          const food = foods[i];
          if (
            !tempUsedNames.has(food.name) &&
            !usedFoodNames.has(food.name) &&
            food.calories >= minCaloriesPerFood &&
            food.calories <= maxCaloriesPerFood
          ) {
            selectedFoods.push(food);
            tempUsedNames.add(food.name);
          }
        }

        // If we still don't have enough, try again with more relaxed constraints
        if (selectedFoods.length < count) {
          continue;
        }
      }

      // Check if this combination is in excluded combinations
      if (selectedFoods.length === count) {
        const foodSignature = selectedFoods
          .map((food) => food.name)
          .sort()
          .join("|");

        if (excludedCombinations[mealType].has(foodSignature)) {
          // Try again with the top items excluded
          selectedFoods.forEach((food) => excludedFoods.add(food.name));
          continue;
        }

        // Valid new combination - add to used foods
        selectedFoods.forEach((food) => usedFoodNames.add(food.name));

        // Add to all excluded foods for this meal type
        selectedFoods.forEach((food) => {
          allExcludedFoods.current[mealType].add(food.name);
        });

        break;
      }
    }

    // If we couldn't find a valid combination after all attempts
    if (selectedFoods.length < count) {
      console.log(`${mealType}: Using fallback foods - all attempts exhausted`);

      // Reset excluded foods for this meal type to avoid getting stuck
      allExcludedFoods.current[mealType].clear();

      // Fallback to any available foods that meet calorie requirements
      const fallbackFoods = foods
        .filter(
          (food) =>
            !usedFoodNames.has(food.name) &&
            food.calories >= minCaloriesPerFood &&
            food.calories <= maxCaloriesPerFood
        )
        .slice(0, count);

      // If we still don't have enough, take any available foods
      if (fallbackFoods.length < count) {
        const anyFoods = foods
          .filter((food) => !usedFoodNames.has(food.name))
          .sort(
            (a, b) =>
              Math.abs(a.calories - perFoodTarget) -
              Math.abs(b.calories - perFoodTarget)
          )
          .slice(0, count);

        anyFoods.forEach((food) => usedFoodNames.add(food.name));
        return anyFoods;
      }

      fallbackFoods.forEach((food) => usedFoodNames.add(food.name));
      return fallbackFoods;
    }

    return selectedFoods;
  };

  const recommendFoods = (calorieNeeds: number) => {
    const calculateMealCalories = (totalCalories: number) => {
      const breakfastCalories = Math.round(totalCalories * 0.25);
      const lunchCalories = Math.round(totalCalories * 0.5);
      const dinnerCalories = Math.round(totalCalories * 0.25);
      return { breakfastCalories, lunchCalories, dinnerCalories };
    };

    const { breakfastCalories, lunchCalories, dinnerCalories } =
      calculateMealCalories(calorieNeeds);

    // Clear used foods when generating full recommendations
    usedFoodNames.clear();

    // Reset excluded combinations
    setExcludedCombinations({
      breakfast: new Set(),
      lunch: new Set(),
      dinner: new Set(),
    });

    // Get multiple recommendations for each meal
    const breakfast = getMultipleRecommendations(
      breakfastCalories,
      "breakfast"
    );
    const lunch = getMultipleRecommendations(lunchCalories, "lunch");
    const dinner = getMultipleRecommendations(dinnerCalories, "dinner");

    setRecommendedFoods({
      breakfast,
      lunch,
      dinner,
    });

    setBreakfastCalories(breakfastCalories);
    setLunchCalories(lunchCalories);
    setDinnerCalories(dinnerCalories);
  };

  // Function to get new recommendations for an entire meal
  // const getNewMealRecommendations = (
  //   mealType: "breakfast" | "lunch" | "dinner"
  // ) => {
  //   // Add current recommendations to excluded foods for this meal
  //   const currentFoods = recommendedFoods[mealType];

  //   if (currentFoods && currentFoods.length > 0) {
  //     // Create a signature for this combination of foods
  //     const foodSignature = currentFoods
  //       .map((food) => food.name)
  //       .sort()
  //       .join("|");

  //     setExcludedCombinations((prev) => {
  //       const newExcluded = new Set(prev[mealType]);
  //       newExcluded.add(foodSignature);
  //       return {
  //         ...prev,
  //         [mealType]: newExcluded,
  //       };
  //     });

  //     // Remove these foods from used foods
  //     currentFoods.forEach((food) => {
  //       usedFoodNames.delete(food.name);
  //     });
  //   }

  //   const excludedFoodsSet = new Set<string>();
  //   // Get target calories for this meal
  //   let targetCalories;
  //   if (mealType === "breakfast") targetCalories = breakfastCalories || 0;
  //   else if (mealType === "lunch") targetCalories = lunchCalories || 0;
  //   else targetCalories = dinnerCalories || 0;

  //   // Get new recommendations for this meal
  //   // const excludedFoods = new Set<string>();
  //   // currentFoods.forEach(food => excludedFoods.add(food.name));

  //   const newRecommendations = getMultipleRecommendations(
  //     targetCalories,
  //     mealType,
  //     excludedFoodsSet
  //   );

  //   // Update recommendations state for just this meal
  //   setRecommendedFoods((prev) => ({
  //     ...prev,
  //     [mealType]: newRecommendations,
  //   }));
  // };

  const getNewMealRecommendations = (
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    // Increment menu change count
    setMenuChangeCount((prev) => ({
      ...prev,
      [mealType]: prev[mealType] + 1,
    }));

    console.log(
      `Getting new ${mealType} menu (change #${menuChangeCount[mealType] + 1})`
    );

    // Add current recommendations to excluded foods for this meal
    const currentFoods = recommendedFoods[mealType];

    if (currentFoods && currentFoods.length > 0) {
      // Create a signature for this combination of foods
      const foodSignature = currentFoods
        .map((food) => food.name)
        .sort()
        .join("|");

      // Add to excluded combinations
      setExcludedCombinations((prev) => {
        const newExcluded = new Set(prev[mealType]);
        newExcluded.add(foodSignature);

        // Reset if we've excluded too many combinations to prevent getting stuck
        // This allows continuous use without needing a reset button
        if (newExcluded.size > 15) {
          console.log(
            `${mealType}: Too many exclusions, resetting except current combination`
          );
          return {
            ...prev,
            [mealType]: new Set([foodSignature]), // Keep only the current
          };
        }

        return {
          ...prev,
          [mealType]: newExcluded,
        };
      });

      // Remove these foods from used foods
      currentFoods.forEach((food) => {
        usedFoodNames.delete(food.name);
      });
    }

    // Build a comprehensive set of foods to exclude
    const excludedFoodsSet = new Set<string>();

    // Add foods from other meals that should be excluded
    for (const [type, foods] of Object.entries(recommendedFoods)) {
      if (type !== mealType) {
        // Don't exclude from the meal we're changing
        foods.forEach((food) => excludedFoodsSet.add(food.name));
      }
    }

    // If we've changed menu many times, start clearing old exclusions gradually
    // This ensures we don't get stuck with too many excluded foods
    const changeThreshold = 10;
    if (menuChangeCount[mealType] > changeThreshold) {
      // Start clearing past exclusions gradually
      const clearFactor = Math.min(
        0.9,
        (menuChangeCount[mealType] - changeThreshold) * 0.1
      );

      // Only use a subset of excluded foods to avoid getting stuck
      let excludedCounter = 0;
      allExcludedFoods.current[mealType].forEach((food) => {
        // Add only some of the excluded foods based on clearFactor
        if (Math.random() > clearFactor) {
          excludedFoodsSet.add(food);
          excludedCounter++;
        }
      });
      console.log(
        `${mealType}: Using ${excludedCounter} of ${allExcludedFoods.current[mealType].size} excluded foods after ${menuChangeCount[mealType]} changes`
      );
    } else {
      // Add all previously excluded foods for this meal if we haven't changed too many times
      allExcludedFoods.current[mealType].forEach((food) => {
        excludedFoodsSet.add(food);
      });
    }

    // Get target calories for this meal
    let targetCalories;
    if (mealType === "breakfast") targetCalories = breakfastCalories || 0;
    else if (mealType === "lunch") targetCalories = lunchCalories || 0;
    else targetCalories = dinnerCalories || 0;

    // Dynamically adjust max attempts based on how many times we've changed the menu
    // This gives better results for frequent menu changes
    const dynamicMaxAttempts = Math.min(30, 20 + menuChangeCount[mealType]);

    // Get new recommendations for this meal
    const newRecommendations = getMultipleRecommendations(
      targetCalories,
      mealType,
      excludedFoodsSet,
      3,
      dynamicMaxAttempts // Dynamically increased max attempts
    );

    // Update recommendations state for just this meal
    setRecommendedFoods((prev) => ({
      ...prev,
      [mealType]: newRecommendations,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);
    const ageNum = parseInt(formData.age, 10);

    const idealWeightRange = calculateIdealWeight(heightNum);
    const calorieNeedsValue = calculateCalorieNeeds(
      weightNum,
      heightNum,
      ageNum,
      formData.gender,
      formData.activityLevel
    );
    setIdealWeight(idealWeightRange);
    setCalorieNeeds(calorieNeedsValue);

    const [minIdealWeight, maxIdealWeight] = idealWeightRange
      .split(" - ")
      .map((w) => parseFloat(w));
    let statusMessage = "";
    let adjustedCalories = calorieNeedsValue;

    if (weightNum < minIdealWeight) {
      adjustedCalories += 500;
      statusMessage = `Berat badan Anda kurang. Untuk mencapai berat ideal, tingkatkan asupan kalori harian Anda hingga ${adjustedCalories} kcal dan fokus pada makanan bergizi tinggi.`;
    } else if (weightNum > maxIdealWeight) {
      adjustedCalories -= 500;
      statusMessage = `Berat badan Anda berlebih. Untuk mencapai berat ideal, kurangi asupan kalori harian menjadi sekitar ${adjustedCalories} kcal.`;
    } else {
      statusMessage = `Berat badan Anda sudah ideal. Pertahankan pola makan dan aktivitas fisik untuk menjaga kesehatan Anda.`;
    }

    setSuccess(statusMessage);

    calculateDailyNutrientNeeds(
      adjustedCalories,
      weightNum,
      ageNum,
      formData.gender
    );

    recommendFoods(adjustedCalories);

    setLoading(false);
  };

  // Helper function to render a meal's food recommendations
  const renderMealCard = (
    foods: Food[],
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!foods || foods.length === 0) {
      return (
        <div className="mt-2 p-4 bg-yellow-100 text-amber-800 rounded-lg">
          <p>Tidak ada rekomendasi yang tersedia untuk saat ini.</p>
        </div>
      );
    }

    let targetCalories;
    if (mealType === "breakfast") targetCalories = breakfastCalories;
    else if (mealType === "lunch") targetCalories = lunchCalories;
    else targetCalories = dinnerCalories;

    // Calculate total calories from all foods in this meal
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const caloriePercentage = targetCalories
      ? Math.round((totalCalories / targetCalories) * 100)
      : 0;

    let mealTitle;
    if (mealType === "breakfast") mealTitle = "Sarapan";
    else if (mealType === "lunch") mealTitle = "Makan Siang";
    else mealTitle = "Makan Malam";

    return (
      <div className="mt-2 border-2 border-[#00712D] bg-white/80 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center border-b border-[#00712D]/30 pb-2 mb-3">
          <h2 className="font-bold text-xl">Menu {mealTitle}</h2>
          <button
            onClick={() => getNewMealRecommendations(mealType)}
            className="bg-[#D5ED9F] text-[#00712D] py-1 px-4 rounded-full font-medium hover:bg-[#c0e47a] transition-colors"
          >
            Ganti Menu
          </button>
        </div>

        {/* Total calories progress */}

        {/* Individual food items */}
        <div className="space-y-3">
          {foods.map((food, index) => (
            <div key={index} className="p-3 bg-[#D5ED9F]/10 rounded-lg">
              <div className="font-bold mb-1">{food.name}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Kalori:</span> {food.calories}{" "}
                  kcal
                </div>
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Protein:</span> {food.protein}{" "}
                  g
                </div>
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Lemak:</span> {food.fat} g
                </div>
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Karbohidrat:</span>{" "}
                  {food.carbs} g
                </div>
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Sodium:</span> {food.sodium}{" "}
                  mg
                </div>
                <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                  <span className="font-semibold">Porsi:</span>{" "}
                  {food.porpotionSize || 100}g
                </div>
              </div>
            </div>
          ))}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Total Kalori:</span>
              <span>
                {totalCalories} kcal ({caloriePercentage}% dari target)
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  caloriePercentage <= 80
                    ? "bg-green-600"
                    : caloriePercentage <= 110
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(caloriePercentage, 150)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="md:container mx-2 md:mx-auto p-6 text-white bg-[#00712D] mt-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Rekomendasi Makanan Sehat</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2" htmlFor="weight">
              Berat Badan (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="text-[#0d1821] bg-white outline-[#0d1821] rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="height">
              Tinggi Badan (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="age">
              Usia (tahun)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="gender">
              Jenis Kelamin
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block mb-2" htmlFor="activityLevel">
              Tingkat Aktivitas
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
            >
              <option value="sedentary">Sedentary (Minim aktivitas)</option>
              <option value="light">
                Ringan (Olahraga ringan 1-3 hari/minggu)
              </option>
              <option value="moderate">
                Sedang (Olahraga moderat 3-5 hari/minggu)
              </option>
              <option value="active">
                Aktif (Olahraga intensif 6-7 hari/minggu)
              </option>
            </select>
          </div>

          {error && (
            <p className="absolute top-0 w-[80%] text-red-500 px-2 py-1 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-[#D5ED9F] font-semibold w-full text-[#00712D] py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      <div className="md:container mx-2 md:mx-auto mb-5 rounded-xl">
        {idealWeight && (
          <div className="mt-4 bg-[#D5ED9F] text-[#00712D] rounded-lg p-4 ">
            <h2 className="text-xl font-semibold">
              Berat Badan IdealMu: {idealWeight}
            </h2>
            {success && (
              <p className="w-full text-[#FF9100] bg-[#FFFBE6] px-2 py-1 rounded-lg">
                Note: {success}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <h3 className="mt-2">Kalori HarianMu: {calorieNeeds}kcal</h3>
              <h3 className="mt-2">Protein HarianMu: {dailyProteinNeeds}g</h3>
              <h3 className="mt-2">Gula HarianMu: {dailySugarNeeds}g</h3>
              <h3 className="mt-2">Sodium HarianMu: {dailySodiumNeeds}g</h3>
              <h3 className="mt-2">Karbohidrat HarianMu: {dailyCarbsNeeds}g</h3>
              <h3 className="mt-2">
                Batas Lemak Jenuh HarianMu: {saturedFatLimit}g
              </h3>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">
                Pembagian Kalori Harian:
              </h3>
              <ul className="mt-5 grid lg:grid-cols-3 justify-between text-center items-center ">
                <li className="bg-white/80 w-52 rounded-full py-1 translate-x-1/2">
                  Sarapan: {breakfastCalories} kcal
                </li>
                <li className="bg-white/80 w-52 rounded-full py-1 translate-x-1/2">
                  Makan Siang: {lunchCalories} kcal
                </li>
                <li className="bg-white/80 w-52 rounded-full py-1 translate-x-1/2">
                  Makan Malam: {dinnerCalories} kcal
                </li>
              </ul>
            </div>
            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              {/* Breakfast recommendation */}
              <div className="mt-4">
                <h3 className="lg:hidden text-xl font-semibold">
                  Rekomendasi Sarapan:
                </h3>
                {renderMealCard(recommendedFoods.breakfast, "breakfast")}
              </div>

              {/* Lunch recommendation */}
              <div className="mt-4">
                <h3 className="lg:hidden text-xl font-semibold">
                  Rekomendasi Makan Siang:
                </h3>
                {renderMealCard(recommendedFoods.lunch, "lunch")}
              </div>

              {/* Dinner recommendation */}
              <div className="mt-4">
                <h3 className="lg:hidden text-xl font-semibold">
                  Rekomendasi Makan Malam:
                </h3>
                {renderMealCard(recommendedFoods.dinner, "dinner")}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FoodRecommendation;
