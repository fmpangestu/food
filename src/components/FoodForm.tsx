/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Food } from "../types/food";
import { Button } from "./ui/button";

type FormData = Omit<Food, "_id">;

type FormDisplayState = {
  [K in keyof Omit<Food, "_id">]: string;
} & { kategori: string }; // tambahkan kategori di state!

interface FoodFormProps {
  initialData?: Food | null;
  onSubmit?: (data: Food) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export default function FoodForm({ initialData }: FoodFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormDisplayState>({
    Menu: "",
    "Energy (kcal)": "",
    "Protein (g)": "",
    "Fat (g)": "",
    "Carbohydrates (g)": "",
    "Sugar (g)": "",
    "Sodium (mg)": "",
    "Portion Size (g)": "",
    kategori: "", // <-- tambahkan default kategori!
  });

  useEffect(() => {
    if (initialData) {
      const { _id, ...dataToEdit } = initialData;
      const stringifiedData: FormDisplayState = {
        ...Object.fromEntries(
          Object.entries(dataToEdit).map(([key, value]) => [
            key,
            value !== undefined && value !== null ? String(value) : "",
          ])
        ),
        kategori: (initialData as any).kategori ?? "", // Pastikan kategori terisi!
      } as FormDisplayState;
      setFormData((currentData) => ({ ...currentData, ...stringifiedData }));
    }
  }, [initialData]);

  // Fungsi ini yang membuat Anda BISA mengetik
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    // Perbaikan: Gunakan endpoint /api/foods/
    const url = isEditMode
      ? `/api/foods/${encodeURIComponent(foodIdentifier)}`
      : "/api/foods";

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
    <form onSubmit={handleSubmit} className="space-y-4 ">
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          name="kategori"
          value={formData.kategori}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
          disabled={isSubmitting}
        >
          <option value="">-- Pilih Kategori --</option>
          <option value="Pokok">Pokok</option>
          <option value="Lauk Hewani">Lauk Hewani</option>
          <option value="Lauk Nabati">Lauk Nabati</option>
          <option value="Sayur">Sayur</option>
          <option value="Buah">Buah</option>
        </select>
      </div>

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
          className="flex-1 bg-red-500 hover:bg-red-600"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
