export interface Food {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  porpotionSize: number;
  similarityScore?: number;
}

export interface FormData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
}

export interface RecommendationResult {
  idealWeight: string;
  calorieNeeds: number;
  dailySugarNeeds: number;
  dailySodiumNeeds: number;
  dailyProteinNeeds: number;
  dailyCarbsNeeds: number;
  saturedFatLimit: number;
  breakfastCalories: number;
  lunchCalories: number;
  dinnerCalories: number;
  statusMessage: string;
}
