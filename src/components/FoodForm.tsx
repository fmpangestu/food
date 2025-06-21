/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Food } from "../types/food";
import { Button } from "./ui/button";

type FormData = Omit<Food, "_id">;

interface FoodFormProps {
  initialData?: Food | null;
}

export default function FoodForm({ initialData }: FoodFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    Menu: "",
    "Energy (kcal)": 0,
    "Protein (g)": 0,
    "Fat (g)": 0,
    "Carbohydrates (g)": 0,
    "Sugar (g)": 0,
    "Sodium (mg)": 0,
    "Portion Size (g)": 100,
  });

  useEffect(() => {
    if (initialData) {
      const { _id, ...dataToEdit } = initialData;
      setFormData((currentData) => ({ ...currentData, ...dataToEdit }));
    }
  }, [initialData]);

  // Fungsi ini yang membuat Anda BISA mengetik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Logika submit sekarang ada DI DALAM komponen ini
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Pastikan kita menggunakan nama 'Menu' dari data yang diedit
    const foodIdentifier = initialData?.Menu || formData.Menu;

    // Perbaikan: Gunakan endpoint /api/fods/
    const url = isEditMode
      ? `/api/fods/${encodeURIComponent(foodIdentifier)}`
      : "/api/fods";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal memproses data makanan");
      }

      toast.success(
        `Makanan berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`
      );
      // Arahkan kembali ke halaman admin setelah sukses
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: { name: keyof FormData; label: string; type: string }[] = [
    { name: "Menu", label: "Nama Makanan", type: "text" },
    { name: "Energy (kcal)", label: "Kalori (kcal)", type: "number" },
    { name: "Protein (g)", label: "Protein (g)", type: "number" },
    { name: "Fat (g)", label: "Lemak (g)", type: "number" },
    { name: "Carbohydrates (g)", label: "Karbohidrat (g)", type: "number" },
    { name: "Sugar (g)", label: "Gula (g)", type: "number" },
    { name: "Sodium (mg)", label: "Sodium (mg)", type: "number" },
    { name: "Portion Size (g)", label: "Porsi (g)", type: "number" },
  ];

  return (
    // Form ini sekarang menangani event submit-nya sendiri
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            // value dan onChange terhubung ke state internal komponen ini
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting || (isEditMode && field.name === "Menu")}
          />
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEditMode
            ? "Update Makanan"
            : "Tambah Makanan"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin")}
          className="flex-1 bg-gray-500 hover:bg-gray-600"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
