"use client";
import { useEffect, useState } from "react";
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
  const [recommendedFoods, setRecommendedFoods] = useState<{
    breakfast: Food | null;
    lunch: Food | null;
    dinner: Food | null;
  }>({ breakfast: null, lunch: null, dinner: null });
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
  const [excludedFoods, setExcludedFoods] = useState<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });

  useEffect(() => {
    const fetchFoods = async () => {
      const data = await readCSV("/foods.csv");
      if (!data || data.length === 0) {
        console.error("No foods loaded or empty data array");
      } else {
        console.log("Loaded foods sample:", data.slice(0, 3));
      }
      setFoods(data);
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

  const getRecommendation = (
    targetCalories: number,
    mealType: "breakfast" | "lunch" | "dinner",
    excludedFoods: Set<string> = new Set()
  ): Food | null => {
    // Set calorie constraints based on meal type
    let minCalories, maxCalories;

    if (mealType === "breakfast") {
      minCalories = targetCalories * 0.75;
      maxCalories = targetCalories * 1.1;
    } else if (mealType === "dinner") {
      minCalories = targetCalories * 0.7;
      maxCalories = targetCalories * 1.3;
    } else {
      minCalories = targetCalories * 0.8;
      maxCalories = targetCalories * 1.2;
    }

    console.log(
      `${mealType} target: ${targetCalories}, range: ${minCalories}-${maxCalories}`
    );

    // Filter foods by calorie range and exclude already used foods
    let availableFoods = foods.filter(
      (food) =>
        food.calories >= minCalories &&
        food.calories <= maxCalories &&
        !usedFoodNames.has(food.name) &&
        !excludedFoods.has(food.name)
    );

    // If no foods in range, expand range
    if (availableFoods.length === 0) {
      console.log(`No foods in range for ${mealType}, expanding range`);
      availableFoods = foods.filter(
        (food) => !usedFoodNames.has(food.name) && !excludedFoods.has(food.name)
      );
    }

    // If still no foods, allow previously excluded foods
    if (availableFoods.length === 0) {
      console.log(
        `No available foods for ${mealType}, allowing excluded foods`
      );
      availableFoods = foods.filter((food) => !usedFoodNames.has(food.name));
    }

    // If still no foods, return null
    if (availableFoods.length === 0) {
      return null;
    }

    // Create target "profile" for similarity calculation
    const targetProfile = {
      calories: targetCalories,
      protein: dailyProteinNeeds
        ? dailyProteinNeeds * (mealType === "lunch" ? 0.5 : 0.25)
        : 0,
      carbs: dailyCarbsNeeds
        ? dailyCarbsNeeds * (mealType === "lunch" ? 0.5 : 0.25)
        : 0,
      fat: (targetCalories * 0.3) / 9,
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

      // // Calculate similarity with specific focus on calories matching
      // const calorieMatch =
      //   1 - Math.abs(food.calories - targetCalories) / targetCalories;

      // Calculate similarity with specific focus on calories matching
      let calorieMatch =
        1 - Math.abs(food.calories - targetCalories) / targetCalories;

      // Add penalty for exceeding target calories, especially for breakfast
      if (food.calories > targetCalories) {
        const overagePercent =
          (food.calories - targetCalories) / targetCalories;

        // Breakfast should have heavier penalty for being over
        if (mealType === "breakfast") {
          calorieMatch -= overagePercent * 0.5; // Higher penalty for breakfast
        } else {
          calorieMatch -= overagePercent * 0.3; // Normal penalty for lunch/dinner
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

    // Pick the best match
    const bestMatch = sortedFoods[0];

    // Mark this food as used
    if (bestMatch) {
      usedFoodNames.add(bestMatch.name);
    }

    return bestMatch || null;
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

    // Reset excluded foods
    setExcludedFoods({
      breakfast: new Set(),
      lunch: new Set(),
      dinner: new Set(),
    });

    // Get recommendations for each meal
    const breakfast = getRecommendation(breakfastCalories, "breakfast");
    const lunch = getRecommendation(lunchCalories, "lunch");
    const dinner = getRecommendation(dinnerCalories, "dinner");

    setRecommendedFoods({
      breakfast,
      lunch,
      dinner,
    });

    setBreakfastCalories(breakfastCalories);
    setLunchCalories(lunchCalories);
    setDinnerCalories(dinnerCalories);
  };

  // Function to get a new recommendation for a specific meal
  const getNewRecommendation = (mealType: "breakfast" | "lunch" | "dinner") => {
    // Add current recommendation to excluded foods for this meal
    const currentFood = recommendedFoods[mealType];

    if (currentFood) {
      setExcludedFoods((prev) => {
        const newExcluded = new Set(prev[mealType]);
        newExcluded.add(currentFood.name);

        // Remove this food from usedFoodNames so we don't track it anymore
        usedFoodNames.delete(currentFood.name);

        return {
          ...prev,
          [mealType]: newExcluded,
        };
      });
    }

    // Get target calories for this meal
    let targetCalories;
    if (mealType === "breakfast") targetCalories = breakfastCalories || 0;
    else if (mealType === "lunch") targetCalories = lunchCalories || 0;
    else targetCalories = dinnerCalories || 0;

    // Generate new recommendation
    const newRecommendation = getRecommendation(
      targetCalories,
      mealType,
      excludedFoods[mealType]
    );

    // Update recommendations state for just this meal
    setRecommendedFoods((prev) => ({
      ...prev,
      [mealType]: newRecommendation,
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

  // Helper function to render a food recommendation card
  const renderFoodCard = (
    food: Food | null,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!food) {
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

    const caloriePercentage = targetCalories
      ? Math.round((food.calories / targetCalories) * 100)
      : 0;

    return (
      <div className="mt-2 border-2 border-[#00712D] bg-white/80 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center border-b border-[#00712D]/30 pb-2 mb-3">
          <h2 className="font-bold text-xl">{food.name}</h2>
          <button
            onClick={() => getNewRecommendation(mealType)}
            className="bg-[#D5ED9F] text-[#00712D] py-1 px-4 rounded-full font-medium hover:bg-[#c0e47a] transition-colors"
          >
            Ganti Menu
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Kalori:</span> {food.calories} kcal
          </div>
          <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Protein:</span> {food.protein} g
          </div>
          <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Lemak:</span> {food.fat} g
          </div>
          <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Karbohidrat:</span> {food.carbs} g
          </div>
          <div className=" bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Sodium:</span> {food.sodium} mg
          </div>
          <div className=" bg-[#D5ED9F]/20 p-2 rounded-lg">
            <span className="font-semibold">Porsi:{food.porpotionSize} g</span>
          </div>
        </div>

        {targetCalories && (
          <div className="mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>
                Target kalori: {targetCalories} kcal ({caloriePercentage}% dari
                target)
              </span>
            </div>
            <div className="mt-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
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
        )}
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
              <p className=" w-full text-[#FF9100] bg-[#FFFBE6] px-2 py-1 rounded-lg">
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
              {recommendedFoods.breakfast !== null && (
                <div className="mt-4">
                  <h3 className="lg:hidden text-xl font-semibold">
                    Rekomendasi Sarapan:
                  </h3>
                  {renderFoodCard(recommendedFoods.breakfast, "breakfast")}
                </div>
              )}

              {/* Lunch recommendation */}
              {recommendedFoods.lunch !== null && (
                <div className="mt-4">
                  <h3 className="lg:hidden text-xl font-semibold">
                    Rekomendasi Makan Siang:
                  </h3>
                  {renderFoodCard(recommendedFoods.lunch, "lunch")}
                </div>
              )}

              {/* Dinner recommendation */}
              {recommendedFoods.dinner !== null && (
                <div className="mt-4">
                  <h3 className="lg:hidden text-xl font-semibold">
                    Rekomendasi Makan Malam:
                  </h3>
                  {renderFoodCard(recommendedFoods.dinner, "dinner")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FoodRecommendation;
