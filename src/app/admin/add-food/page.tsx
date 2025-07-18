"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FoodForm from "@/components/FoodForm";
import { Food } from "@/types/food";

export default function AddFoodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: Food) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add food");
      }

      router.push("/admin");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 mt-5 max-w-2xl mx-auto bg-white rounded-md shadow-[0px_2px_6px_0.1px_#a0aec0]">
      <h1 className="text-2xl italic text-gray-500 font-bold mb-6 text-center">
        Tambah Data
        <span className="text-green-600"> Makan</span>
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <FoodForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitText="Add Food"
        onCancel={() => router.push("/admin")}
      />
    </div>
  );
}
