/* eslint-disable @typescript-eslint/no-explicit-any */
export async function saveSelection(
  formData: any,
  selectedFoods: any,
  summaryInfo: any,
  userId: any
) {
  const res = await fetch("/api/save-selection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formData, selectedFoods, summaryInfo, userId }),
  });
  if (!res.ok) throw new Error("Gagal menyimpan ke database");
  return res.json();
}
