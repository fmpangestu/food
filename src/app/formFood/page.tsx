/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";

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
  category: string;
  calories: number;
  protein: number;
  preparation: string;
  fat: number;
  carbs: number;
  portion_weight: number;
  description: string;
  serving_size: string;
  ingredients: string[];
}

const FoodRecommendation = () => {
  const [formData, setFormData] = useState<FormData>({
    weight: "",
    height: "",
    age: "",
    gender: "male", // Default gender
    activityLevel: "sedentary", // Default activity level
  });
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Success state
  const [idealWeight, setIdealWeight] = useState<string | null>(null); // Ideal weight state
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null); // Calorie needs state
  //   const router = useRouter();
  const [dailySugarNeeds, setDailySugarNeeds] = useState<number | null>(null);
  const [dailySodiumNeeds, setDailySodiumNeeds] = useState<number | null>(null);
  const [dailyProteinNeeds, setDailyProteinNeeds] = useState<number | null>(
    null
  );
  const [dailyCarbsNeeds, setDailyCarbsNeeds] = useState<number | null>(null);
  const [saturedFatLimit, setSaturedFatLimit] = useState<number | null>(null);

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
      setSuccess(null); // Reset success message
      return false;
    }
    setError(null);
    return true;
  };

  const calculateIdealWeight = (height: number) => {
    const minBMI = 18.5;
    const maxBMI = 24.9;
    const heightInMeters = height / 100; // Convert cm to meters
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
    // Mifflin-St Jeor Equation to calculate BMR
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust BMR based on activity level
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    return Math.round(bmr * (activityFactors[activityLevel] || 1.2)); // Default to sedentary if no match
  };
  const calculateDailyNutrientNeeds = (
    calories: number,
    weight: number,
    age: number,
    gender: string
  ) => {
    const proteinNeeds = Math.round(weight * 0.8); // gram per kg berat badan
    const sugarNeeds = Math.min((calories * 0.1) / 4, 50); // 1 gram gula = 4 kalori
    setDailySugarNeeds(sugarNeeds); // gram, rekomendasi umum
    let sodiumNeeds: number;
    if (age < 1) {
      sodiumNeeds = 1; // 1 gram per hari
    } else if (age <= 3) {
      sodiumNeeds = 2; // 2 gram per hari
    } else if (age <= 6) {
      sodiumNeeds = 3; // 3 gram per hari
    } else if (age <= 10) {
      sodiumNeeds = 5; // 5 gram per hari
    } else {
      sodiumNeeds = 6; // 6 gram per hari
    }
    const saturedFatLimit = gender === "male" ? 30 : 20;
    const carbsNeeds = Math.round(calories * 0.55) / 4; // 1 gram karbohidrat = 4 kalori
    setDailySodiumNeeds(sodiumNeeds); // mg, rekomendasi umum
    setDailyProteinNeeds(proteinNeeds);
    setDailySugarNeeds(sugarNeeds);
    setDailySodiumNeeds(sodiumNeeds);
    setDailyCarbsNeeds(carbsNeeds);
    setSaturedFatLimit(saturedFatLimit);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null); // Reset success message before fetch

    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);
    const ageNum = parseInt(formData.age, 10);

    // Calculate ideal weight and calorie needs
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

    calculateDailyNutrientNeeds(
      calorieNeedsValue,
      weightNum,
      ageNum,
      formData.gender
    );
    // Evaluate weight status
    const [minIdealWeight, maxIdealWeight] = idealWeightRange
      .split(" - ")
      .map((w) => parseFloat(w));
    let statusMessage = "";
    if (weightNum < minIdealWeight) {
      const surplusCalories = calorieNeedsValue + 500; // Surplus calories for weight gain
      statusMessage = `Berat badan Anda kurang. Untuk mencapai berat ideal, tingkatkan asupan kalori harian Anda hingga ${surplusCalories} kcal dan fokus pada makanan bergizi tinggi.`;
    } else if (weightNum > maxIdealWeight) {
      const deficitCalories = calorieNeedsValue - 500; // Deficit calories for weight loss
      statusMessage = `Berat badan Anda berlebih. Untuk mencapai berat ideal, kurangi asupan kalori harian menjadi sekitar ${deficitCalories} kcal.`;
    } else {
      statusMessage = `Berat badan Anda sudah ideal. Pertahankan pola makan dan aktivitas fisik untuk menjaga kesehatan Anda.`;
    }

    setSuccess(statusMessage);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mendapatkan rekomendasi.");
      }

      const data = await res.json();
      setFoods(data.foods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
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
            className="text-black border p-2 w-full"
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
            className="text-black border p-2 w-full"
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
            className="text-black border p-2 w-full"
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
            className="text-black border p-2 w-full"
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
            className="text-black border p-2 w-full"
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
          className="bg-green-500 font-semibold w-full text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {idealWeight && (
        <div className="mt-4 bg-white text-gray-700 rounded-lg p-4 ">
          <h2 className="text-xl font-semibold">
            Berat Badan IdealMu: {idealWeight}
          </h2>
          {success && (
            <p className=" w-full text-white bg-green-500 px-2 py-1 rounded-lg">
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
          {/* {success && <p className="mt-2 text-green-500">{success}</p>} */}
        </div>
      )}

      {foods.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Rekomendasi Makanan:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {foods.map((food, index) => (
              <div key={index} className="border border-white rounded-md p-4">
                <h2 className="font-semibold text-lg">{food.name}</h2>
                <p>Deskripsi: {food.description}</p>
                <p>Persiapan: {food.preparation}</p>
                <p>porsi: {food.portion_weight}g</p>
                <p>Kategori: {food.category}</p>
                <h4>Nutrisi</h4>
                <ul>
                  <li>Protein: {food.protein} g</li>
                  <p>Kalori: {food.calories} kcal</p>
                  <li>fat: {food.fat} g</li>
                  <li>Carbs: {food.carbs} g</li>
                  <li>Serving Size: {food.serving_size}</li>
                </ul>
                <h4>Resep:</h4>
                <ul className="list-disc ">
                  {food.ingredients.map((ingredient, index) => (
                    <li key={index} className="list-inside">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodRecommendation;
