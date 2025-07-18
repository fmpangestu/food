/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox } from "@/components/ui/checkbox";
import { Food } from "@/app/formFood/page";
import { FoodUI, SelectedFoods } from "@/types/food";

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
    <div className="mt-2 bg-[#F1F0E9] rounded-lg p-4">
      <div className="flex justify-between items-center border-b border-[#00712D]/30 pb-2 mb-3">
        <h2 className="font-semibold text-sm lg:text-lg text-[#0D4715]">
          {mealTitle}
        </h2>
        <button
          onClick={() => getNewMealRecommendations(mealType)}
          className="bg-[#E9762B] text-white italic py-1 px-4 text-[10px] lg:text-sm rounded-md font-medium hover:bg-[#E9762B]/60 transition-colors"
        >
          Ganti Rekomendasi
        </button>
      </div>
      <div className="space-y-3">
        {foods.map((food, index) => (
          <div
            key={index}
            className="relative p-3 bg-gradient-to-r from-[#004030] to-[#41644A] rounded-lg"
          >
            <Checkbox
              className="absolute z-96 right-4 top-2 h-4 w-4"
              checked={selectedFoods[mealType].some(
                (f) => f.name === food.name
              )}
              onCheckedChange={() => onSelectFood(mealType, food)}
            />
            <div className="font-bold mt-2 mb-1">{food.name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Kalori:</span> {food.calories}{" "}
                kcal
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Protein:</span> {food.protein} g
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Lemak:</span> {food.fat} g
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Karbohidrat:</span> {food.carbs}{" "}
                g
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Sodium:</span> {food.sodium} mg
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Gula:</span> {food.sugar} mg
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Porsi:</span>{" "}
                {food.porpotionSize || 100}g
              </div>
              <div className="bg-[#D5ED9F]/20 p-2 rounded-lg">
                <span className="font-semibold">Kategori:</span> {food.kategori}{" "}
                g
              </div>
            </div>
          </div>
        ))}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1 text-[#0D4715]">
            <span className="font-semibold">Total Kalori Pilihan:</span>
            <span>{selectedCalories} kcal dari target</span>
          </div>
          <div className="bg-[#0D4715]/20 rounded-full h-2">
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
