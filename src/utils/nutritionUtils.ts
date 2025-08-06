/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateForm(
  formData: any,
  setError: (msg: string | null) => void,
  setSuccess: (msg: string | null) => void
): boolean {
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
}

// export function calculateIdealWeight(height: number): string {
//   const minBMI = 18.5;
//   const maxBMI = 24.9;
//   const heightInMeters = height / 100;
//   const minWeight = minBMI * heightInMeters * heightInMeters;
//   const maxWeight = maxBMI * heightInMeters * heightInMeters;
//   return `${Math.round(minWeight)} - ${Math.round(maxWeight)} kg`;
// }
export function calculateIdealWeight(
  height: number,
  gender: string
): { range: string; ideal: number } {
  const ideal =
    gender === "male"
      ? height - 100 - (height - 100) * 0.1
      : height - 100 - (height - 100) * 0.15;
  const min = Math.round(ideal * 0.9);
  const max = Math.round(ideal * 1.1);
  return {
    range: `${min} - ${max} kg`,
    ideal: Math.round(ideal),
  };
}
export function calculateCalorieNeeds(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string
): number {
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  let activityFactors: { [key: string]: number };
  if (gender === "male") {
    activityFactors = {
      sedentary: 1.2,
      light: 1.5,
      moderate: 1.8,
      active: 2.1,
    };
  } else {
    activityFactors = {
      sedentary: 1.2,
      light: 1.5,
      moderate: 1.7,
      active: 1.8,
    };
  }

  // const activityFactors: { [key: string]: number } = {
  //   sedentary: 1.2,
  //   light: 1.5,
  //   moderate: 1.8,
  //   active: 2.1,
  // };
  return Math.round(bmr * (activityFactors[activityLevel] || 1.2));
}

export function calculateDailyNutrientNeeds(
  calories: number,
  weight: number,
  age: number,
  gender: string
) {
  const proteinNeeds = Math.round(weight * 0.8);
  const sugarNeeds = Math.min((calories * 0.1) / 4, 50);
  let sodiumNeeds: number;
  if (age < 1) sodiumNeeds = 1;
  else if (age <= 3) sodiumNeeds = 2;
  else if (age <= 6) sodiumNeeds = 3;
  else if (age <= 10) sodiumNeeds = 5;
  else sodiumNeeds = 6;
  const saturedFatLimit = gender === "male" ? 30 : 20;
  const carbsNeeds = Math.round(calories * 0.55) / 4;
  return {
    proteinNeeds,
    sugarNeeds,
    sodiumNeeds,
    saturedFatLimit,
    carbsNeeds,
  };
}
