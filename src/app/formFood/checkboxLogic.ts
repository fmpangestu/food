import { Food } from "./page"; // pastikan path dan tipe Food sesuai

export type SelectedFoods = {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
};

export function handleSelectFood(
  prev: SelectedFoods,
  meal: keyof SelectedFoods,
  food: Food
): SelectedFoods {
  const kategori = food.kategori;
  // Hapus makanan dengan kategori sama, lalu tambahkan yang baru jika belum ada
  const filtered = prev[meal].filter((f) => f.kategori !== kategori);
  const already = prev[meal].some((f) => f.name === food.name);
  return {
    ...prev,
    [meal]: already ? filtered : [...filtered, food],
  };
}
