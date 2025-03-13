"use client";

import { useState, useEffect } from "react";
import { Food } from "../types/food";

interface FoodFormProps {
  initialData?: Food;
  onSubmit: (data: Food) => Promise<void>;
  isSubmitting: boolean;
  submitText: string;
  onCancel: () => void;
}

export default function FoodForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitText,
  onCancel,
}: FoodFormProps) {
  const [formData, setFormData] = useState<Food>({
    name: "",
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sodium: 0,
    porpotionSize: 100,
  });

  // Load initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Calories</label>
        <input
          type="number"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Protein (g)</label>
        <input
          type="number"
          name="protein"
          value={formData.protein}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          step="0.1"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Fat (g)</label>
        <input
          type="number"
          name="fat"
          value={formData.fat}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          step="0.1"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Carbs (g)</label>
        <input
          type="number"
          name="carbs"
          value={formData.carbs}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          step="0.1"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Sodium (mg)</label>
        <input
          type="number"
          name="sodium"
          value={formData.sodium}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Portion Size (g)</label>
        <input
          type="number"
          name="porpotionSize"
          value={formData.porpotionSize}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {isSubmitting ? "Processing..." : submitText}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
