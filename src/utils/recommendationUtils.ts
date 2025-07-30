/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cosineSimilarity from "@/lib/cosineSimilarity";
import { Food } from "@/app/formFood/page";

export type MealType = "breakfast" | "lunch" | "dinner";

const allowedPokokSarapan = [
  "roti",
  "oat",
  "sereal",
  "bubur",
  "quaker",
  "sandwich",
];

export function getBahanUtama(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("bubur")) return "bubur";
  if (lower.includes("sandwich")) return "sandwich";
  if (lower.includes("tahu")) return "tahu";
  if (lower.includes("ayam")) return "ayam";
  if (lower.includes("telur")) return "telur";
  if (lower.includes("tempe")) return "tempe";
  if (lower.includes("daging")) return "daging";
  if (lower.includes("ikan")) return "ikan";
  if (lower.includes("udang")) return "udang";
  if (lower.includes("nasi")) return "nasi";
  if (lower.includes("roti")) return "roti";
  if (lower.includes("oat")) return "oat";
  if (lower.includes("kentang")) return "kentang";
  if (lower.includes("tumis")) return "tumis";
  if (lower.includes("sayur")) return "sayur";
  if (lower.includes("sup")) return "sup";
  if (lower.includes("quaker")) return "quaker";
  if (lower.includes("sereal")) return "sereal";
  if (lower.includes("alpukat")) return "alpukat";
  if (lower.includes("apel")) return "apel";
  if (lower.includes("mangga")) return "mangga";
  if (lower.includes("melon")) return "melon";
  if (lower.includes("naga")) return "naga";
  if (lower.includes("pepaya")) return "pepaya";
  if (lower.includes("semangka")) return "semangka";
  return lower.split(" ")[0];
}

export function isCaloriesClose(
  foods: Food[],
  target: number,
  tolerance = 0.18
) {
  const total = foods.reduce((sum, f) => sum + f.calories, 0);
  return Math.abs(total - target) <= target * tolerance;
}

// --- Cari kombinasi structured: 1 pokok, 1 lauk/sayur, 1 buah, unik
export function getStructuredRecommendation(
  foods: Food[],
  targetCalories: number,
  dailyProteinNeeds: number | null,
  dailyCarbsNeeds: number | null,
  mealType: MealType,
  foodsToExclude: Set<string> = new Set()
): Food[] {
  // Filter pool
  const pool = foods.filter((f) => !foodsToExclude.has(f.name));

  // Pokok
  const pokokPool = pool.filter(
    (f) =>
      f.kategori === "Pokok" &&
      ((mealType === "breakfast" &&
        allowedPokokSarapan.includes(getBahanUtama(f.name))) ||
        (mealType !== "breakfast" &&
          !allowedPokokSarapan.includes(getBahanUtama(f.name))))
  );

  // Lauk/Sayur (bukan pokok/buah)
  const laukSayurPool = pool.filter((f) =>
    ["Lauk Hewani", "Lauk Nabati", "Sayur"].includes(f.kategori)
  );

  // Buah
  const buahPool = pool.filter((f) => f.kategori === "Buah");

  // Skoring cosine untuk tiap kategori
  const pokok = pokokPool
    .map((f) => ({
      ...f,
      similarityScore: cosineSimilarity(
        [f.calories, f.protein, f.carbs, f.fat],
        [
          targetCalories * 0.5,
          dailyProteinNeeds ? dailyProteinNeeds * 0.4 : 0,
          dailyCarbsNeeds ? dailyCarbsNeeds * 0.4 : 0,
          0,
        ]
      ),
    }))
    .sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0))[0];

  // Lauk/Sayur: pilih yang bahan utama beda dengan pokok
  const laukSayur = laukSayurPool
    .map((f) => ({
      ...f,
      similarityScore: cosineSimilarity(
        [f.calories, f.protein, f.carbs, f.fat],
        [
          targetCalories * 0.3,
          dailyProteinNeeds ? dailyProteinNeeds * 0.4 : 0,
          dailyCarbsNeeds ? dailyCarbsNeeds * 0.2 : 0,
          0,
        ]
      ),
    }))
    .sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0))
    .find(
      (f) =>
        pokok &&
        getBahanUtama(f.name) !== getBahanUtama(pokok.name) &&
        f.name !== pokok.name
    );

  // Buah: pilih yang bahan utama beda dengan pokok & lauk/sayur
  const buah = buahPool
    .map((f) => ({
      ...f,
      similarityScore: cosineSimilarity(
        [f.calories, f.protein, f.carbs, f.fat],
        [
          targetCalories * 0.2,
          0,
          dailyCarbsNeeds ? dailyCarbsNeeds * 0.2 : 0,
          0,
        ]
      ),
    }))
    .sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0))
    .find(
      (f) =>
        pokok &&
        laukSayur &&
        getBahanUtama(f.name) !== getBahanUtama(pokok.name) &&
        getBahanUtama(f.name) !== getBahanUtama(laukSayur.name) &&
        f.name !== pokok.name &&
        f.name !== laukSayur.name
    );

  // Susun hasil
  const combo = [pokok, laukSayur, buah].filter(Boolean) as Food[];

  // Fallback: kalau ada yang kurang, ambil random dari pool unik kategori
  if (combo.length < 3) {
    const taken = new Set(combo.map((f) => f.name));
    // Pokok
    const pokokFallback = pokokPool.find((f) => !taken.has(f.name));
    if (pokokFallback && !combo.find((f) => f.kategori === "Pokok"))
      combo.push(pokokFallback);
    // Lauk/Sayur
    const laukFallback = laukSayurPool.find((f) => !taken.has(f.name));
    if (
      laukFallback &&
      !combo.find((f) =>
        ["Lauk Hewani", "Lauk Nabati", "Sayur"].includes(f.kategori)
      )
    )
      combo.push(laukFallback);
    // Buah
    const buahFallback = buahPool.find((f) => !taken.has(f.name));
    if (buahFallback && !combo.find((f) => f.kategori === "Buah"))
      combo.push(buahFallback);

    // Jika masih kurang, random dari pool
    if (combo.length < 3) {
      const sisa = pool
        .filter((f) => !taken.has(f.name))
        .slice(0, 3 - combo.length);
      return [...combo, ...sisa];
    }
  }
  return combo.slice(0, 3);
}

// --- Kombinasi unik, anti duplikat, selalu 1 pokok, 1 lauk/sayur, 1 buah ---
export function getMultipleRecommendations(
  foods: Food[],
  recommendedFoods: { [key: string]: Food[] },
  dailyProteinNeeds: number | null,
  dailyCarbsNeeds: number | null,
  targetCalories: number,
  mealType: MealType,
  foodsToExclude: Set<string> = new Set(),
  count: number = 3,
  maxAttempts: number = 30,
  excludedCombos: Set<string> = new Set()
): Food[] {
  // Filter pool
  const pool = foods.filter((f) => !foodsToExclude.has(f.name));

  // Pool per kategori
  const pokokPool = pool.filter(
    (f) =>
      f.kategori === "Pokok" &&
      ((mealType === "breakfast" &&
        allowedPokokSarapan.includes(getBahanUtama(f.name))) ||
        (mealType !== "breakfast" &&
          !allowedPokokSarapan.includes(getBahanUtama(f.name))))
  );
  const laukSayurPool = pool.filter((f) =>
    ["Lauk Hewani", "Lauk Nabati", "Sayur"].includes(f.kategori)
  );
  const buahPool = pool.filter((f) => f.kategori === "Buah");

  // Coba kombinasi unik hingga maxAttempts
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Urutkan berdasarkan cosine similarity
    const pokokList = [...pokokPool]
      .map((f) => ({
        ...f,
        similarityScore: cosineSimilarity(
          [f.calories, f.protein, f.carbs, f.fat],
          [
            targetCalories * 0.5,
            dailyProteinNeeds ? dailyProteinNeeds * 0.4 : 0,
            dailyCarbsNeeds ? dailyCarbsNeeds * 0.4 : 0,
            0,
          ]
        ),
      }))
      .sort(() => Math.random() - 0.5); // tetap random, tapi urutkan similarity jika mau

    const laukList = [...laukSayurPool]
      .map((f) => ({
        ...f,
        similarityScore: cosineSimilarity(
          [f.calories, f.protein, f.carbs, f.fat],
          [
            targetCalories * 0.3,
            dailyProteinNeeds ? dailyProteinNeeds * 0.4 : 0,
            dailyCarbsNeeds ? dailyCarbsNeeds * 0.2 : 0,
            0,
          ]
        ),
      }))
      .sort(() => Math.random() - 0.5);

    const buahList = [...buahPool]
      .map((f) => ({
        ...f,
        similarityScore: cosineSimilarity(
          [f.calories, f.protein, f.carbs, f.fat],
          [
            targetCalories * 0.2,
            0,
            dailyCarbsNeeds ? dailyCarbsNeeds * 0.2 : 0,
            0,
          ]
        ),
      }))
      .sort(() => Math.random() - 0.5);

    for (const pokok of pokokList) {
      for (const lauk of laukList) {
        if (
          getBahanUtama(pokok.name) === getBahanUtama(lauk.name) ||
          pokok.name === lauk.name
        )
          continue;
        for (const buah of buahList) {
          if (
            new Set([
              getBahanUtama(pokok.name),
              getBahanUtama(lauk.name),
              getBahanUtama(buah.name),
            ]).size !== 3
          )
            continue;
          if (new Set([pokok.name, lauk.name, buah.name]).size !== 3) continue;
          const combo = [pokok, lauk, buah];
          const signature = combo
            .map((f) => f.name)
            .sort()
            .join("|");
          if (excludedCombos.has(signature)) continue;
          if (isCaloriesClose(combo, targetCalories, 0.18)) {
            excludedCombos.add(signature);
            return combo;
          }
        }
      }
    }
  }
  // Fallback: tetap jaga struktur meal
  const result: Food[] = [];
  const takenNama = new Set<string>();
  const takenBahan = new Set<string>();

  // Pokok
  const pokokFallback = pokokPool.find(
    (f) =>
      !takenNama.has(f.name) &&
      !takenBahan.has(getBahanUtama(f.name)) &&
      ((mealType === "breakfast" &&
        allowedPokokSarapan.includes(getBahanUtama(f.name))) ||
        (mealType !== "breakfast" &&
          !allowedPokokSarapan.includes(getBahanUtama(f.name))))
  );
  if (pokokFallback) {
    result.push(pokokFallback);
    takenNama.add(pokokFallback.name);
    takenBahan.add(getBahanUtama(pokokFallback.name));
  }
  // Lauk/Sayur
  const laukFallback = laukSayurPool.find(
    (f) =>
      !takenNama.has(f.name) &&
      !takenBahan.has(getBahanUtama(f.name)) &&
      f.kategori !== "Pokok"
  );
  if (laukFallback) {
    result.push(laukFallback);
    takenNama.add(laukFallback.name);
    takenBahan.add(getBahanUtama(laukFallback.name));
  }
  // Buah
  const buahFallback = buahPool.find(
    (f) => !takenNama.has(f.name) && !takenBahan.has(getBahanUtama(f.name))
  );
  if (buahFallback) {
    result.push(buahFallback);
    takenNama.add(buahFallback.name);
    takenBahan.add(getBahanUtama(buahFallback.name));
  }

  // Jika masih kurang, prioritas buah dulu, lalu lauk/sayur, lalu pokok
  if (result.length < count) {
    if (!result.some((f) => f.kategori === "Buah") && buahPool.length > 0) {
      const buahRandom = buahPool.find((f) => !takenNama.has(f.name));
      if (buahRandom) result.push(buahRandom);
    }
    const kategoriUrutan = [
      buahPool,
      laukSayurPool,
      pokokPool.filter(
        (f) =>
          (mealType === "breakfast" &&
            allowedPokokSarapan.includes(getBahanUtama(f.name))) ||
          (mealType !== "breakfast" &&
            !allowedPokokSarapan.includes(getBahanUtama(f.name)))
      ),
    ];
    for (const kategori of kategoriUrutan) {
      for (const f of kategori) {
        if (
          result.length < count &&
          !takenNama.has(f.name) &&
          !takenBahan.has(getBahanUtama(f.name))
        ) {
          result.push(f);
          takenNama.add(f.name);
          takenBahan.add(getBahanUtama(f.name));
        }
      }
    }
  }

  // Jika masih kurang, random dari pool yang belum diambil
  if (result.length < count) {
    const sisa = pool
      .filter(
        (f) => !takenNama.has(f.name) && !takenBahan.has(getBahanUtama(f.name))
      )
      .slice(0, count - result.length);
    result.push(...sisa);
  }
  // Pastikan hanya 1 pokok, 1 lauk/sayur, dan 1 buah (jika data cukup)
  const finalPokok = result.find((f) => f.kategori === "Pokok");
  const finalLauk = result.find((f) =>
    ["Lauk Hewani", "Lauk Nabati", "Sayur"].includes(f.kategori)
  );
  const finalBuah = result.find((f) => f.kategori === "Buah");

  const finalCombo: Food[] = [];
  if (finalPokok) finalCombo.push(finalPokok);
  if (finalLauk) finalCombo.push(finalLauk);
  if (finalBuah) finalCombo.push(finalBuah);

  // Jika data sangat terbatas, isi random dari pool yang belum diambil kategori-nya
  if (finalCombo.length < count) {
    // Ambil makanan lain yang kategori-nya belum ada di finalCombo
    const kategoriSudah = new Set(finalCombo.map((f) => f.kategori));
    for (const f of result) {
      if (
        !finalCombo.includes(f) &&
        !kategoriSudah.has(f.kategori) &&
        finalCombo.length < count
      ) {
        finalCombo.push(f);
        kategoriSudah.add(f.kategori);
      }
    }
    // Jika masih kurang, baru isi random dari result (tanpa cek kategori)
    for (const f of result) {
      if (!finalCombo.includes(f) && finalCombo.length < count) {
        finalCombo.push(f);
      }
    }
  }

  // Filter agar tidak ada double kategori pokok/lauk/buah
  const uniqueByKategori: { [kategori: string]: Food } = {};
  for (const food of finalCombo) {
    if (!uniqueByKategori[food.kategori]) {
      uniqueByKategori[food.kategori] = food;
    }
  }
  let resultArr = Object.values(uniqueByKategori).slice(0, count);

  // --- Tambahkan randomisasi agar hasil fallback tidak selalu sama ---
  for (let i = resultArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultArr[i], resultArr[j]] = [resultArr[j], resultArr[i]];
  }
  return resultArr;
}

export function recommendFoods(
  calorieNeeds: number,
  foods: Food[],
  dailyProteinNeeds: number | null,
  dailyCarbsNeeds: number | null,
  setRecommendedFoods: React.Dispatch<
    React.SetStateAction<{ breakfast: Food[]; lunch: Food[]; dinner: Food[] }>
  >,
  setBreakfastCalories: (val: number) => void,
  setLunchCalories: (val: number) => void,
  setDinnerCalories: (val: number) => void,
  excludedCombos?: {
    breakfast: Set<string>;
    lunch: Set<string>;
    dinner: Set<string>;
  } // Tambahan
) {
  const breakfastCalories = Math.round(calorieNeeds * 0.25);
  const lunchCalories = Math.round(calorieNeeds * 0.4);
  const dinnerCalories = Math.round(calorieNeeds * 0.35);

  // Siapkan set untuk anti duplikat
  const breakfastExcluded = excludedCombos?.breakfast ?? new Set<string>();
  const lunchExcluded = excludedCombos?.lunch ?? new Set<string>();
  const dinnerExcluded = excludedCombos?.dinner ?? new Set<string>();

  const breakfast = getMultipleRecommendations(
    foods,
    { breakfast: [], lunch: [], dinner: [] },
    dailyProteinNeeds,
    dailyCarbsNeeds,
    breakfastCalories,
    "breakfast",
    new Set(),
    3,
    30,
    breakfastExcluded
  );
  const lunch = getMultipleRecommendations(
    foods,
    { breakfast, lunch: [], dinner: [] },
    dailyProteinNeeds,
    dailyCarbsNeeds,
    lunchCalories,
    "lunch",
    new Set(breakfast.map((f) => f.name)),
    3,
    30,
    lunchExcluded
  );
  // const dinner = getMultipleRecommendations(
  //   foods,
  //   { breakfast, lunch, dinner: [] },
  //   dailyProteinNeeds,
  //   dailyCarbsNeeds,
  //   dinnerCalories,
  //   "dinner",
  //   new Set([...breakfast, ...lunch].map((f) => f.name)),
  //   3,
  //   30,
  //   dinnerExcluded
  // );
  const dinnerFoodsToExclude = new Set(
    breakfast
      .filter((f) => f.kategori === "Pokok")
      .concat(lunch.filter((f) => f.kategori === "Pokok"))
      .map((f) => f.name)
  );

  const dinner = getMultipleRecommendations(
    foods,
    { breakfast, lunch, dinner: [] },
    dailyProteinNeeds,
    dailyCarbsNeeds,
    dinnerCalories,
    "dinner",
    dinnerFoodsToExclude,
    3,
    30,
    dinnerExcluded
  );
  setRecommendedFoods({
    breakfast: breakfast.slice(),
    lunch: lunch.slice(),
    dinner: dinner.slice(),
  });
  setBreakfastCalories(breakfastCalories);
  setLunchCalories(lunchCalories);
  setDinnerCalories(dinnerCalories);
}
