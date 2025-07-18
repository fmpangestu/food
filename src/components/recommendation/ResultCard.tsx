/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectedFoods } from "@/types/food";
import MealCard from "./MealCard";
import { Food } from "@/app/formFood/page";
// pastikan path import sesuai

type IdealWeight = {
  ideal: number | string;
  range: string;
};

type RecommendedFoods = {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
};

interface ResultCardProps {
  idealWeight: IdealWeight;
  success: string | null;
  calorieNeeds: number | null;
  dailyProteinNeeds: number | null;
  dailySugarNeeds: number | null;
  dailySodiumNeeds: number | null;
  dailyCarbsNeeds: number | null;
  saturedFatLimit: number | null;
  breakfastCalories: number | null;
  lunchCalories: number | null;
  dinnerCalories: number | null;
  recommendedFoods: RecommendedFoods;
  selectedFoods: SelectedFoods;
  onSelectFood: (meal: keyof SelectedFoods, food: Food) => void;
  handleNewMeal: (mealType: "breakfast" | "lunch" | "dinner") => void;
  saveData: boolean;
  saveSelection: (
    formData: any,
    selectedFoods: any,
    nutritionInfo: any,
    userId: string | null | undefined
  ) => Promise<void>;
  formData: any;
  userId: string | null | undefined;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
  setSaveData: (saveData: boolean) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  idealWeight,
  success,
  calorieNeeds,
  dailyProteinNeeds,
  dailySugarNeeds,
  dailySodiumNeeds,
  dailyCarbsNeeds,
  saturedFatLimit,
  breakfastCalories,
  lunchCalories,
  dinnerCalories,
  recommendedFoods,
  selectedFoods,
  onSelectFood,
  handleNewMeal,
  saveData,
  saveSelection,
  formData,
  userId,
  setSuccess,
  setError,
  setSaveData,
}) => (
  <div
    style={{ animation: "fadeInUp 0.7s cubic-bezier(.4,0,.2,1)" }}
    className="mt-4 bg-[#004030] text-white rounded-lg p-4 shadow-[0px_2px_7px_0.1px_#2d3748] "
  >
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-sm lg:text-xl font-semibold">
        Berat Badan IdealMu: {idealWeight.ideal} kg{" "}
        <span className="italic text-sm">(Dari = {idealWeight.range}) </span>
      </h2>
      {/* button print */}
    </div>
    {success && (
      <div className="p-[3px] bg-[#F1F0E9] rounded-lg">
        <p className="w-full  text-[#004030] bg-clip-text px-2 py-1 rounded-md">
          Note: {success}
        </p>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <h3 className="mt-2">Kalori HarianMu: {calorieNeeds}kcal</h3>
      <h3 className="mt-2">Protein HarianMu: {dailyProteinNeeds}g</h3>
      <h3 className="mt-2">
        Gula HarianMu:{" "}
        {dailySugarNeeds !== null && dailySugarNeeds !== undefined
          ? Number(dailySugarNeeds).toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "-"}
        g
      </h3>
      <h3 className="mt-2">Sodium HarianMu: {dailySodiumNeeds}g</h3>
      <h3 className="mt-2">Karbohidrat HarianMu: {dailyCarbsNeeds}g</h3>
      <h3 className="mt-2">Batas Lemak Jenuh HarianMu: {saturedFatLimit}g</h3>
    </div>
    <div className="hidden lg:block mt-4">
      <h3 className="text-xl font-semibold">Pembagian Kalori Harian:</h3>
      <ul className="mt-5 grid text-[#0D4715] font-semibold lg:grid-cols-3 justify-between text-center items-center ">
        <li className="bg-white w-52 rounded-md py-1 translate-x-1/2">
          Sarapan: {breakfastCalories} kcal
        </li>
        <li className="bg-white w-52 rounded-md py-1 translate-x-1/2">
          Makan Siang: {lunchCalories} kcal
        </li>
        <li className="bg-white w-52 rounded-md py-1 translate-x-1/2">
          Makan Malam: {dinnerCalories} kcal
        </li>
      </ul>
    </div>
    <div className="grid lg:grid-cols-3 gap-4 mt-4">
      <div className="mt-4">
        <h3 className="lg:hidden text-xl font-semibold">
          Rekomendasi Sarapan: {breakfastCalories} kcal
        </h3>
        <MealCard
          foods={recommendedFoods.breakfast}
          mealType="breakfast"
          selectedFoods={selectedFoods}
          onSelectFood={onSelectFood}
          getNewMealRecommendations={handleNewMeal}
          targetCalories={breakfastCalories}
        />
      </div>
      <div className="mt-4">
        <h3 className="lg:hidden text-xl font-semibold">
          Rekomendasi Makan Siang: {lunchCalories} kcal
        </h3>
        <MealCard
          foods={recommendedFoods.lunch}
          mealType="lunch"
          selectedFoods={selectedFoods}
          onSelectFood={onSelectFood}
          getNewMealRecommendations={handleNewMeal}
          targetCalories={lunchCalories}
        />
      </div>
      <div className="mt-4">
        <h3 className="lg:hidden text-xl font-semibold">
          Rekomendasi Makan Malam: {dinnerCalories} kcal
        </h3>
        <MealCard
          foods={recommendedFoods.dinner}
          mealType="dinner"
          selectedFoods={selectedFoods}
          onSelectFood={onSelectFood}
          getNewMealRecommendations={handleNewMeal}
          targetCalories={dinnerCalories}
        />
      </div>
    </div>
    <div className="mt-6 flex justify-end">
      <button
        className="bg-white min-w-full text-[#0D4715] px-6 py-2 rounded-lg font-semibold hover:bg-white/50 transition"
        onClick={async () => {
          setSaveData(true);
          try {
            await saveSelection(
              formData,
              selectedFoods,
              {
                idealWeight,
                note: success,
                calorieNeeds,
                dailySugarNeeds,
                dailySodiumNeeds,
                dailyProteinNeeds,
                dailyCarbsNeeds,
                saturedFatLimit,
                breakfastCalories,
                lunchCalories,
                dinnerCalories,
              },
              userId
            );
            setSuccess("Pilihan makanan berhasil disimpan!");
          } catch {
            setError("Gagal menyimpan ke database.");
          }
          setSaveData(false);
        }}
        disabled={saveData}
      >
        {saveData ? "Menyimpan..." : "Simpan Pilihan"}
      </button>
    </div>
  </div>
);

export default ResultCard;
