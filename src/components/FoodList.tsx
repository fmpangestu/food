"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Food } from "../types/food";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface FoodListProps {
  // Ganti nama prop agar lebih jelas dan sesuai dengan AdminPage
  initialFoods: Food[];
}

export default function FoodList({ initialFoods }: FoodListProps) {
  const [foods, setFoods] = useState<Food[]>(initialFoods);
  const [searchTerm, setSearchTerm] = useState("");
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setFoods(initialFoods);
  }, [initialFoods]);

  const filteredFoods = (Array.isArray(foods) ? foods : []).filter((food) =>
    food.Menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteConfirmation = (foodName: string) => {
    setFoodToDelete(foodName);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!foodToDelete) return;
    setIsDeleting(true);
    try {
      const url = `/api/fods/${encodeURIComponent(foodToDelete)}`;
      const response = await fetch(url, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus makanan");
      }
      setFoods((prevFoods) =>
        prevFoods.filter((food) => food.Menu !== foodToDelete)
      );
      toast.success(`Makanan "${foodToDelete}" berhasil dihapus`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Gagal menghapus makanan: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setFoodToDelete(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        {/* ... input pencarian ... */}
        <input
          type="text"
          placeholder="Cari makanan..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Makanan</th>
              <th className="border p-2">Energi (kcal)</th>
              <th className="border p-2">Protein (g)</th>
              <th className="border p-2">Lemak (g)</th>
              <th className="border p-2">Karbohidrat (g)</th>
              <th className="border p-2">Gula (g)</th>
              <th className="border p-2">Sodium (mg)</th>
              <th className="border p-2">Porsi (g)</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          {/* PASTIKAN STRUKTUR INI DIIKUTI DENGAN BENAR */}
          <tbody>
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <tr key={String(food._id) || food.Menu}>
                  <td className="border p-2 text-center">
                    {foods.indexOf(food) + 1}
                  </td>
                  <td className="border p-2">{food.Menu}</td>
                  <td className="border p-2">{food["Energy (kcal)"]}</td>
                  <td className="border p-2">{food["Protein (g)"]}</td>
                  <td className="border p-2">{food["Fat (g)"]}</td>
                  <td className="border p-2">{food["Carbohydrates (g)"]}</td>
                  <td className="border p-2">{food["Sugar (g)"] ?? "N/A"}</td>
                  <td className="border p-2">{food["Sodium (mg)"]}</td>
                  <td className="border p-2">{food["Portion Size (g)"]}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/edit-food/${encodeURIComponent(
                          food.Menu
                        )}`}
                        className="bg-blue-500 text-white w-1/2 px-1 flex justify-center items-center text-center py-1 rounded-md hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </Link>
                      <Button
                        onClick={() => openDeleteConfirmation(food.Menu)}
                        className="bg-red-500 text-white w-1/2 px-1 text-center py-1 rounded-md hover:bg-red-600 text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Ini adalah cara yang BENAR untuk menampilkan pesan "kosong"
              <tr>
                <td colSpan={9} className="border p-4 text-center">
                  {searchTerm
                    ? "Tidak ada makanan yang cocok"
                    : "Tidak ada makanan tersedia"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ... AlertDialog ... */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus makanan {foodToDelete}?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
