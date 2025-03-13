/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
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
  AlertDialogTrigger,
} from "./ui/alert-dialog";
interface FoodListProps {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  handleDelete: (foodName: string) => Promise<void>;
}

export default function FoodList({ foods, setFoods }: FoodListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteConfirmation = (foodName: string) => {
    setFoodToDelete(foodName);
    setIsAlertOpen(true);
  };
  const handleDelete = async () => {
    if (!foodToDelete) return;

    setIsDeleting(true);
    try {
      console.log(`Mencoba menghapus makanan: "${foodToDelete}"`);

      const url = `/api/foods/${encodeURIComponent(foodToDelete)}`;
      console.log(`Mengirim request DELETE ke: ${url}`);

      const response = await fetch(url, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        console.error("Delete response error:", data);
        throw new Error(data.error || "Gagal menghapus makanan");
      }

      console.log("Makanan berhasil dihapus");
      setFoods(foods.filter((food) => food.name !== foodToDelete));

      // Tampilkan notifikasi sukses
      toast.success(`Makanan "${foodToDelete}" berhasil dihapus`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Gagal menghapus makanan: ${errorMessage}`);
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setFoodToDelete(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search foods..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Calories</th>
              <th className="border p-2">Protein (g)</th>
              <th className="border p-2">Fat (g)</th>
              <th className="border p-2">Carbs (g)</th>
              <th className="border p-2">Sodium (mg)</th>
              <th className="border p-2">Portion (g)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food, index) => (
                <tr key={`${food.name}-${index}`}>
                  <td className="border p-2">{food.name}</td>
                  <td className="border p-2">{food.calories}</td>
                  <td className="border p-2">{food.protein}</td>
                  <td className="border p-2">{food.fat}</td>
                  <td className="border p-2">{food.carbs}</td>
                  <td className="border p-2">{food.sodium}</td>
                  <td className="border p-2">{food.porpotionSize}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/edit-food/${encodeURIComponent(
                          food.name
                        )}`}
                        className="bg-blue-500 text-white w-1/2 px-1 flex justify-center items-center text-center py-1 rounded-md hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </Link>
                      <Button
                        onClick={() => openDeleteConfirmation(food.name)}
                        className="bg-red-500 text-white w-1/2 px-1  text-center py-1 rounded-md hover:bg-red-600 text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border p-4 text-center">
                  {searchTerm
                    ? "No foods match your search"
                    : "No foods available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus makanan "{foodToDelete}"?
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
