/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import FoodTableRow from "./FoodTableRow"; // Pastikan path sudah benar

interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
}

interface PrintRecommendationProps {
  idealWeight: string | null;
  success: string | null;
  calorieNeeds: number | null;
  dailyProteinNeeds: number | null;
  dailyCarbsNeeds: number | null;
  dailySugarNeeds: number | null;
  dailySodiumNeeds: number | null;
  saturedFatLimit: number | null;
  breakfastCalories: number | null;
  lunchCalories: number | null;
  dinnerCalories: number | null;
  recommendedFoods: {
    breakfast: Food[];
    lunch: Food[];
    dinner: Food[];
  };
}

const PrintRecommendation = forwardRef<
  HTMLDivElement,
  PrintRecommendationProps
>(
  (
    {
      idealWeight,
      success,
      calorieNeeds,
      dailyProteinNeeds,
      dailyCarbsNeeds,
      dailySugarNeeds,
      dailySodiumNeeds,
      saturedFatLimit,
      breakfastCalories,
      lunchCalories,
      dinnerCalories,
      recommendedFoods,
    },
    ref
  ) => (
    <div id="print-template" ref={ref} className="hidden bg-white">
      <div className="bg-white container justify-center items-center p-8 max-w-[1100px] mx-auto ">
        <h1 className="text-center text-xl font-bold mb-4">
          REKOMENDASI MAKANAN SEHAT
        </h1>
        <p className="text-right text-sm mb-4">
          Tanggal: {new Date().toLocaleDateString()}
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Informasi Kesehatan</h2>
          <table className="w-full border-collapse border">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">Berat Badan Ideal:</td>
                <td className="border p-2">{idealWeight}</td>
              </tr>
              {success && (
                <tr>
                  <td className="border p-2 font-semibold">Catatan:</td>
                  <td className="border p-2">{success}</td>
                </tr>
              )}
              <tr>
                <td className="border p-2 font-semibold">Kalori Harian:</td>
                <td className="border p-2">{calorieNeeds} kcal</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Protein Harian:</td>
                <td className="border p-2">{dailyProteinNeeds}g</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Karbohidrat Harian:
                </td>
                <td className="border p-2">{dailyCarbsNeeds}g</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Batas Gula Harian:</td>
                <td className="border p-2">{dailySugarNeeds}g</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Batas Sodium Harian:
                </td>
                <td className="border p-2">{dailySodiumNeeds}g</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Batas Lemak Jenuh:</td>
                <td className="border p-2">{saturedFatLimit}g</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Breakfast table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Rekomendasi Sarapan ({breakfastCalories} kcal)
          </h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nama Makanan</th>
                <th className="border p-2">Kalori</th>
                <th className="border p-2">Protein</th>
                <th className="border p-2">Karbo</th>
                <th className="border p-2">Lemak</th>
                <th className="border p-2">Sodium</th>
                <th className="border p-2">Porsi</th>
              </tr>
            </thead>
            <tbody>
              {recommendedFoods.breakfast.map((food, index) => (
                <FoodTableRow
                  food={food}
                  index={index}
                  key={food.name + index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Lunch table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Rekomendasi Makan Siang ({lunchCalories} kcal)
          </h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nama Makanan</th>
                <th className="border p-2">Kalori</th>
                <th className="border p-2">Protein</th>
                <th className="border p-2">Karbo</th>
                <th className="border p-2">Lemak</th>
                <th className="border p-2">Sodium</th>
                <th className="border p-2">Porsi</th>
              </tr>
            </thead>
            <tbody>
              {recommendedFoods.lunch.map((food, index) => (
                <FoodTableRow
                  food={food}
                  index={index}
                  key={food.name + index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Dinner table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Rekomendasi Makan Malam ({dinnerCalories} kcal)
          </h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nama Makanan</th>
                <th className="border p-2">Kalori</th>
                <th className="border p-2">Protein</th>
                <th className="border p-2">Karbo</th>
                <th className="border p-2">Lemak</th>
                <th className="border p-2">Sodium</th>
                <th className="border p-2">Porsi</th>
              </tr>
            </thead>
            <tbody>
              {recommendedFoods.dinner.map((food, index) => (
                <FoodTableRow
                  food={food}
                  index={index}
                  key={food.name + index}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs mt-8 pt-4 border-t">
          <p>
            Rekomendasi ini dibuat berdasarkan perhitungan kebutuhan kalori dan
            nutrisi harian.
          </p>
          <p>
            Konsultasikan dengan ahli gizi profesional untuk rekomendasi yang
            lebih spesifik.
          </p>
        </div>
      </div>
    </div>
  )
);

export default PrintRecommendation;
