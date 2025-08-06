/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/user/Navbar";
import { handleSelectFood, SelectedFoods } from "./checkboxLogic";
import { saveSelection } from "./saveSelection";
import { useSession } from "next-auth/react";
// import MealCard from "@/components/recommendation/MealCard";
import FormFoodInput, {
  getAgeFromBirthDate,
} from "@/components/user/FormInput";
import {
  validateForm,
  calculateIdealWeight,
  calculateCalorieNeeds,
  calculateDailyNutrientNeeds,
} from "@/utils/nutritionUtils";
// HAPUS: import { calculateMealCalories } from "@/utils/mealUtils";
import {
  getMultipleRecommendations,
  recommendFoods,
} from "@/utils/recommendationUtils";
import { getNewMealRecommendations } from "@/utils/newMealUtils";
import ResultCard from "@/components/recommendation/ResultCard";
import { getKategori } from "@/utils/foodKategori";
import EditProfileModal from "@/components/user/EditProfileModal";

export interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
  similarityScore?: number;
  kategori: string;
}
const FoodRecommendation = () => {
  const [showEdit, setShowEdit] = useState(false);
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: "sedentary",
  });

  // Update formData saat session berubah
  useEffect(() => {
    if (session?.user) {
      console.log(session.user);
      setFormData((prev) => ({
        ...prev,
        age: getAgeFromBirthDate(session.user.birthDate || ""),
        gender: session.user.gender || "",
      }));
    }
  }, [session]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [recommendedFoods, setRecommendedFoods] = useState<{
    breakfast: Food[];
    lunch: Food[];
    dinner: Food[];
  }>({ breakfast: [], lunch: [], dinner: [] });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"personal" | "custom">("personal");
  // const [idealWeight, setIdealWeight] = useState<string | null>(null); // sebelum mengembalikan object
  const [idealWeight, setIdealWeight] = useState<{
    range: string;
    ideal: number;
  } | null>(null);
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
  const [menuChangeCount, setMenuChangeCount] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const allExcludedFoods = useRef<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });
  const [excludedCombinations, setExcludedCombinations] = useState<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });
  const [selectedFoods, setSelectedFoods] = useState<SelectedFoods>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const onSelectFood = (meal: keyof SelectedFoods, food: Food) => {
    setSelectedFoods((prev) => handleSelectFood(prev, meal, food));
  };

  const userId = session?.user?.id;
  // Gunakan useRef untuk konsistensi usedFoodNames
  const usedFoodNames = useRef<Set<string>>(new Set());
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("/api/foods");
        if (!response.ok)
          throw new Error("Gagal mengambil data makanan dari server.");
        const dataFromMongo = await response.json();
        if (Array.isArray(dataFromMongo)) {
          const typedData: Food[] = dataFromMongo.map((item: any) => ({
            name: item.Menu,
            calories: Number(item["Energy (kcal)"]),
            protein: Number(item["Protein (g)"]),
            fat: Number(item["Fat (g)"]),
            carbs: Number(item["Carbohydrates (g)"]),
            sodium: Number(item["Sodium (mg)"]),
            sugar: Number(item["Sugar (g)"] ?? 0),
            porpotionSize: Number(item["Portion Size (g)"] || 100),
            similarityScore: undefined,
            kategori: getKategori(item.Menu),
          }));
          setFoods(typedData);
        }
      } catch (error) {
        console.error("Error saat memuat data makanan dari MongoDB:", error);
      }
    };
    fetchFoods();
  }, []);
  useEffect(() => {
    if (mode === "personal" && userId) {
      setProfileLoading(true);
      fetch(`/api/saveProfile?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.formData) {
            setFormData(data.formData);
          }
        });
    } else if (mode === "custom") {
      setFormData({
        weight: "",
        height: "",
        age: "",
        gender: "male",
        activityLevel: "sedentary",
      });
      setProfileLoading(false);
    }
  }, [mode, userId]);
  const handleSave = async () => {
    setSaving(true);
    setTimeout(async () => {
      await fetch("/api/saveProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });
      setSaving(false);
    }, 2000);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // --- Gunakan utils untuk validasi dan kalkulasi ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData, setError, setSuccess)) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTimeout(() => {
      const weightNum = parseFloat(formData.weight);
      const heightNum = parseFloat(formData.height);
      const ageNum = parseInt(formData.age, 10);
      // const idealWeightRange = calculateIdealWeight(heightNum); // bmirumus
      const idealWeightRange = calculateIdealWeight(heightNum, formData.gender);
      const calorieNeedsValue = calculateCalorieNeeds(
        weightNum,
        heightNum,
        ageNum,
        formData.gender,
        formData.activityLevel
      );
      setIdealWeight(idealWeightRange);
      setCalorieNeeds(calorieNeedsValue);
      // const [minIdealWeight, maxIdealWeight] = idealWeightRange
      //   .split(" - ")
      //   .map((w) => parseFloat(w)); sebelum mengembalikan object
      const [minIdealWeight, maxIdealWeight] = idealWeightRange.range
        .replace(" kg", "")
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
      // Kalkulasi kebutuhan nutrisi harian
      const {
        proteinNeeds,
        sugarNeeds,
        sodiumNeeds,
        saturedFatLimit: fatLimit,
        carbsNeeds,
      } = calculateDailyNutrientNeeds(
        adjustedCalories,
        weightNum,
        ageNum,
        formData.gender
      );
      setDailyProteinNeeds(proteinNeeds);
      setDailySugarNeeds(sugarNeeds);
      setDailySodiumNeeds(sodiumNeeds);
      setSaturedFatLimit(fatLimit);
      setDailyCarbsNeeds(carbsNeeds);
      recommendFoods(
        adjustedCalories,
        foods,
        proteinNeeds,
        carbsNeeds,
        setRecommendedFoods,
        setBreakfastCalories,
        setLunchCalories,
        setDinnerCalories,
        excludedCombinations
      );

      setLoading(false);
    }, 5000);
  };
  // Handler untuk ganti menu meal (panggil dari utils)
  const [recommendedHistory, setRecommendedHistory] = useState<{
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  }>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });

  // ...existing code...
  const handleNewMeal = (mealType: "breakfast" | "lunch" | "dinner") => {
    let targetCalories = 0;
    if (mealType === "breakfast") targetCalories = breakfastCalories ?? 0;
    if (mealType === "lunch") targetCalories = lunchCalories ?? 0;
    if (mealType === "dinner") targetCalories = dinnerCalories ?? 0;

    // Exclude makanan yang sedang tampil di meal lain
    const foodsToExclude = new Set(
      Object.entries(recommendedFoods)
        .filter(([key]) => key !== mealType)
        .flatMap(([_, foods]) => foods.map((f) => f.name))
    );

    // Ambil signature kombinasi yang sudah pernah keluar
    const prevSignatures = excludedCombinations[mealType];

    // Dapatkan rekomendasi baru
    setRecommendedFoods((prevFoods) => {
      const newFoods = getMultipleRecommendations(
        foods,
        recommendedFoods,
        dailyProteinNeeds,
        dailyCarbsNeeds,
        targetCalories,
        mealType,
        foodsToExclude,
        3,
        30,
        new Set(prevSignatures) // gunakan signature sebelumnya
      );

      // Tambahkan signature baru ke excludedCombinations
      const newSignature = newFoods
        .map((f) => f.name)
        .sort()
        .join("|");
      setExcludedCombinations((prev) => {
        const updated = { ...prev };
        updated[mealType] = new Set(prev[mealType]);
        updated[mealType].add(newSignature);
        return updated;
      });

      return {
        ...prevFoods,
        [mealType]: newFoods,
      };
    });
  };

  // reff print
  return (
    <>
      <Navbar setShowEdit={setShowEdit} />
      {profileLoading && (
        <div
          style={{ animation: "fadeInUp 0.7s cubic-bezier(.4,0,.2,1)" }}
          className="md:container mx-2 md:mx-auto p-6 text-white  bg-[#004030] mt-4 rounded-xl shadow-[0px_2px_7px_0.1px_#2d3748]"
        >
          <h1 className="text-2xl font-bold mb-4">Rekomendasi Makanan Sehat</h1>
          <div className="hidden w-full gap-2 mb-4">
            <button
              className={`w-full px-2 py-1 rounded-lg transition-colors
      ${
        mode === "personal"
          ? "border-b-2 border-white text-white font-bold"
          : "border-b-0 text-gray-300 hover:text-white"
      }`}
              onClick={() => setMode("personal")}
              type="button"
            >
              Data Pribadi
            </button>
            <button
              className={`w-full px-2 py-1 rounded-lg transition-colors
      ${
        mode === "custom"
          ? "border-b-2 border-white text-white font-bold"
          : "border-b-0 text-gray-300 hover:text-white"
      }`}
              onClick={() => setMode("custom")}
              type="button"
            >
              Data Lain
            </button>
          </div>
          <FormFoodInput
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            error={error}
            saving={saving}
            loading={loading}
            showSave={mode === "personal"}
            onSave={handleSave}
          />
        </div>
      )}
      <div className="md:container mx-2 md:mx-auto mb-5 rounded-xl">
        {idealWeight && !loading && (
          <ResultCard
            idealWeight={idealWeight}
            success={success}
            calorieNeeds={calorieNeeds}
            dailyProteinNeeds={dailyProteinNeeds}
            dailySugarNeeds={dailySugarNeeds}
            dailySodiumNeeds={dailySodiumNeeds}
            dailyCarbsNeeds={dailyCarbsNeeds}
            saturedFatLimit={saturedFatLimit}
            breakfastCalories={breakfastCalories}
            lunchCalories={lunchCalories}
            dinnerCalories={dinnerCalories}
            recommendedFoods={recommendedFoods}
            selectedFoods={selectedFoods}
            onSelectFood={onSelectFood}
            handleNewMeal={handleNewMeal}
            setSaveData={setSaveData}
            saveSelection={saveSelection}
            formData={formData}
            userId={userId}
            setSuccess={setSuccess}
            setError={setError}
            saveData={saveData}
          />
        )}
        {/* tempat print */}
        <p className="text-center mt-4 text-[10px] text-gray-400 italic">
          @2025 -by Farhan Maulana Pangestu
        </p>
      </div>
      {showEdit && session?.user && (
        <EditProfileModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          user={{
            id: session.user.id,
            name: session.user.name || "",
            birthDate: session.user.birthDate,
          }}
        />
      )}
    </>
  );
};
export default FoodRecommendation;
