/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox } from "@/components/ui/checkbox";
import { Food } from "@/app/formFood/page";
import { FoodUI, SelectedFoods } from "@/types/food";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface MealCardProps {
  foods: FoodUI[];
  mealType: "breakfast" | "lunch" | "dinner";
  selectedFoods: SelectedFoods;
  onSelectFood: (meal: keyof SelectedFoods, food: Food) => void;
  getNewMealRecommendations: (meal: "breakfast" | "lunch" | "dinner") => void;
  targetCalories?: number | null;
}

export default function MealCard({
  foods,
  mealType,
  selectedFoods,
  onSelectFood,
  getNewMealRecommendations,
  targetCalories,
}: MealCardProps) {
  if (!foods || foods.length === 0) {
    return (
      <div className="mt-2 p-4 bg-yellow-100 text-amber-800 rounded-lg">
        <p>Tidak ada rekomendasi yang tersedia untuk saat ini.</p>
      </div>
    );
  }
  const selectedCalories = selectedFoods[mealType].reduce(
    (sum, food) => sum + food.calories,
    0
  );
  const selectedCaloriePercentage = targetCalories
    ? Math.round((selectedCalories / targetCalories) * 100)
    : 0;
  // Calculate total calories from all foods in this meal
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const caloriePercentage = targetCalories
    ? Math.round((totalCalories / targetCalories) * 100)
    : 0;

  let mealTitle = "Sarapan";
  if (mealType === "lunch") mealTitle = "Makan Siang";
  else if (mealType === "dinner") mealTitle = "Makan Malam";

  return (
    <div className="mt-2 bg-neutral-100/10 border-t border-l border-neutral-400/10 shadow-[3px_3px_3px_rgba(0,0,0,0.089)] font-semibold text-white rounded-lg p-4">
      {selectedFoods[mealType].length > 0 && (
        <div className="mb-3">
          <span className="font-semibold text-white">Makanan terpilih:</span>
          <ul className="list-disc  ml-5 text-white text-sm">
            {selectedFoods[mealType].map((food) => (
              <li
                key={food.name}
                className="flex justify-between items-center gap-2 mt-1"
              >
                {food.name} ({food.calories} kcal)
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 bg-white  rounded-md p-1 text-red-500 text-xs"
                  onClick={() => onSelectFood(mealType, food)}
                  title="Hapus dari pilihan"
                >
                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  Hapus ?
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between items-center border-b border-white/30 pb-2 mb-3">
        <h2 className="font-semibold text-sm lg:text-lg text-white">
          {mealTitle}
        </h2>
        <button
          onClick={() => getNewMealRecommendations(mealType)}
          className="text-xs md:text-sm bg-neutral-100/10 border-t border-l border-neutral-400/10 shadow-[3px_3px_3px_rgba(0,0,0,0.089)]  text-white rounded-lg p-1.5 transition-colors"
        >
          Ganti Rekomendasi
        </button>
      </div>
      <div className="space-y-3">
        {foods.map((food, index) => (
          <div
            key={index}
            className="relative p-3 bg-transparent text-white rounded-lg"
          >
            <Checkbox
              className="absolute z-96 right-4 top-2 h-4 w-4"
              checked={selectedFoods[mealType].some(
                (f) => f.name === food.name
              )}
              onCheckedChange={() => {
                const isSelected = selectedFoods[mealType].some(
                  (f) => f.name === food.name
                );
                if (!isSelected && selectedFoods[mealType].length >= 3) {
                  toast.error(
                    "Maksimal hanya bisa memilih 3 makanan per waktu makan."
                  );
                  return;
                }
                onSelectFood(mealType, food);
              }}
            />
            <div className="font-bold mt-2 mb-1">{food.name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-[#0D4715]">
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Kalori:</span> {food.calories}{" "}
                kcal
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Protein:</span> {food.protein} g
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Lemak:</span> {food.fat} g
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Karbohidrat:</span> {food.carbs}{" "}
                g
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Sodium:</span> {food.sodium} mg
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Gula:</span> {food.sugar} g
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Porsi:</span>{" "}
                {food.porpotionSize || 100}g
              </div>
              <div className="bg-[white] p-2 rounded-lg">
                <span className="font-semibold">Kategori:</span> {food.kategori}
              </div>
            </div>
          </div>
        ))}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1 text-white">
            <span className="font-semibold">Total Kalori Pilihan:</span>
            <span>{selectedCalories} kcal dari target</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full 
        ${selectedCaloriePercentage > 100 ? "bg-red-500" : "bg-[#E9762B]"}`}
              style={{ width: `${Math.min(selectedCaloriePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
