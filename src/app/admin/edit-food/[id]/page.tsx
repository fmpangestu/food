"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FoodForm from "@/components/FoodForm";
import { Food } from "@/types/food";

export default function EditFoodPage() {
  const params = useParams();
  // Gunakan 'id' sesuai nama folder Anda [id]
  const foodId = decodeURIComponent(params.id as string);

  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!foodId) return;

    const fetchFood = async () => {
      try {
        // Perbaikan: Gunakan endpoint /api/foods/
        const response = await fetch(
          `/api/foods/${encodeURIComponent(foodId)}`
        );

        if (!response.ok) {
          throw new Error("Data makanan tidak ditemukan");
        }
        const fetchedFood = await response.json();
        setFood(fetchedFood);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId]); // Dependency array sudah benar

  // Tampilan loading, error, dan "not found"
  if (loading) {
    return (
      <div className="p-8 text-[#00712D] items-center justify-center flex h-screen">
        Memuat data makanan...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!food) {
    return (
      <div className="p-8 text-center text-red-500">
        Data makanan tidak ditemukan.
      </div>
    );
  }

  // Halaman hanya perlu merender FoodForm dengan data awal
  return (
    <div className="px-4 py-2 mt-5 max-w-2xl mx-auto bg-white rounded-md shadow-[0px_2px_6px_0.1px_#a0aec0]">
      <h1 className="text-2xl italic text-gray-500 font-bold mb-6">
        Edit Makanan <span className="text-green-600">{food.Menu}</span>
      </h1>

      {/* INI BAGIAN KUNCINYA:
        Kita hanya perlu memberikan initialData. 
        Tidak perlu lagi onSubmit, isSubmitting, onCancel, dll.
        karena semua itu sudah diurus di dalam FoodForm.
      */}
      <FoodForm initialData={food} />
    </div>
  );
}
