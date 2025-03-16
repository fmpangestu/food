// "use client";

// import { useState, useEffect } from "react";
// import { Food } from "../types/food";

// interface FoodFormProps {
//   initialData?: Food;
//   onSubmit: (data: Food) => Promise<void>;
//   isSubmitting: boolean;
//   submitText: string;
//   onCancel: () => void;
// }

// export default function FoodForm({
//   initialData,
//   onSubmit,
//   isSubmitting,
//   submitText,
//   onCancel,
// }: FoodFormProps) {
//   const [formData, setFormData] = useState<Food>({
//     name: "",
//     calories: 0,
//     protein: 0,
//     fat: 0,
//     carbs: 0,
//     sodium: 0,
//     porpotionSize: 100,

//   });

//   // Load initial data if provided (for editing)
//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "name" ? value : parseFloat(value) || 0,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block mb-1">Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Calories</label>
//         <input
//           type="number"
//           name="calories"
//           value={formData.calories}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Protein (g)</label>
//         <input
//           type="number"
//           name="protein"
//           value={formData.protein}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           step="0.1"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Fat (g)</label>
//         <input
//           type="number"
//           name="fat"
//           value={formData.fat}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           step="0.1"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Carbs (g)</label>
//         <input
//           type="number"
//           name="carbs"
//           value={formData.carbs}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           step="0.1"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Sodium (mg)</label>
//         <input
//           type="number"
//           name="sodium"
//           value={formData.sodium}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           required
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Portion Size (g)</label>
//         <input
//           type="number"
//           name="porpotionSize"
//           value={formData.porpotionSize}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           required
//         />
//       </div>

//       <div className="flex gap-4">
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//         >
//           {isSubmitting ? "Processing..." : submitText}
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// src/components/FoodForm.tsx
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
  // Inisialisasi dengan nilai default untuk semua format field
  const [formData, setFormData] = useState<Food>({
    // Format camelCase
    name: "",
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sodium: 0,
    porpotionSize: 100,

    // Format kapitalisasi
    Menu: "",
    Energy: 0,
    Protein: 0,
    Fat: 0,
    Carbohydrates: 0,
    Sodium: 0,
    Porpotion_Size: 100,

    // Format dengan unit
    "Energy (kcal)": 0,
    "Protein (g)": 0,
    "Fat (g)": 0,
    "Carbohydrates (g)": 0,
    "Sodium (mg)": 0,
    "Portion Size (g)": 100,
  });

  // Load initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      // Gunakan data yang ada, atau default ke nilai kosong/nol
      setFormData({
        ...initialData,
        // Pastikan semua field memiliki nilai, meskipun tidak ada di initialData
        name: initialData.name || initialData.Menu || "",
        calories:
          initialData.calories ||
          initialData.Energy ||
          initialData["Energy (kcal)"] ||
          0,
        protein:
          initialData.protein ||
          initialData.Protein ||
          initialData["Protein (g)"] ||
          0,
        fat: initialData.fat || initialData.Fat || initialData["Fat (g)"] || 0,
        carbs:
          initialData.carbs ||
          initialData.Carbohydrates ||
          initialData["Carbohydrates (g)"] ||
          0,
        sodium:
          initialData.sodium ||
          initialData.Sodium ||
          initialData["Sodium (mg)"] ||
          0,
        porpotionSize:
          initialData.porpotionSize ||
          initialData.Porpotion_Size ||
          initialData["Portion Size (g)"] ||
          100,

        Menu: initialData.name || initialData.Menu || "",
        Energy:
          initialData.calories ||
          initialData.Energy ||
          initialData["Energy (kcal)"] ||
          0,
        Protein:
          initialData.protein ||
          initialData.Protein ||
          initialData["Protein (g)"] ||
          0,
        Fat: initialData.fat || initialData.Fat || initialData["Fat (g)"] || 0,
        Carbohydrates:
          initialData.carbs ||
          initialData.Carbohydrates ||
          initialData["Carbohydrates (g)"] ||
          0,
        Sodium:
          initialData.sodium ||
          initialData.Sodium ||
          initialData["Sodium (mg)"] ||
          0,
        Porpotion_Size:
          initialData.porpotionSize ||
          initialData.Porpotion_Size ||
          initialData["Portion Size (g)"] ||
          100,

        "Energy (kcal)":
          initialData.calories ||
          initialData.Energy ||
          initialData["Energy (kcal)"] ||
          0,
        "Protein (g)":
          initialData.protein ||
          initialData.Protein ||
          initialData["Protein (g)"] ||
          0,
        "Fat (g)":
          initialData.fat || initialData.Fat || initialData["Fat (g)"] || 0,
        "Carbohydrates (g)":
          initialData.carbs ||
          initialData.Carbohydrates ||
          initialData["Carbohydrates (g)"] ||
          0,
        "Sodium (mg)":
          initialData.sodium ||
          initialData.Sodium ||
          initialData["Sodium (mg)"] ||
          0,
        "Portion Size (g)":
          initialData.porpotionSize ||
          initialData.Porpotion_Size ||
          initialData["Portion Size (g)"] ||
          100,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNameField = name === "name";
    const numValue = isNameField ? value : parseFloat(value) || 0;

    // Update semua format field sekaligus
    if (isNameField) {
      setFormData({
        ...formData,
        name: value,
        Menu: value,
      });
    } else {
      // Update nilai numerik untuk semua format
      switch (name) {
        case "calories":
          setFormData({
            ...formData,
            calories: numValue,
            Energy: numValue,
            "Energy (kcal)": numValue,
          });
          break;
        case "protein":
          setFormData({
            ...formData,
            protein: numValue,
            Protein: numValue,
            "Protein (g)": numValue,
          });
          break;
        case "fat":
          setFormData({
            ...formData,
            fat: numValue,
            Fat: numValue,
            "Fat (g)": numValue,
          });
          break;
        case "carbs":
          setFormData({
            ...formData,
            carbs: numValue,
            Carbohydrates: numValue,
            "Carbohydrates (g)": numValue,
          });
          break;
        case "sodium":
          setFormData({
            ...formData,
            sodium: numValue,
            Sodium: numValue,
            "Sodium (mg)": numValue,
          });
          break;
        case "porpotionSize":
          setFormData({
            ...formData,
            porpotionSize: numValue,
            Porpotion_Size: numValue,
            "Portion Size (g)": numValue,
          });
          break;
        default:
          setFormData({
            ...formData,
            [name]: numValue,
          });
      }
    }
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
          value={formData.Menu || formData.name}
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
          value={
            formData.calories || formData.Energy || formData["Energy (kcal)"]
          }
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
          value={
            formData.protein || formData.Protein || formData["Protein (g)"]
          }
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
          value={formData.fat || formData.Fat || formData["Fat (g)"]}
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
          value={
            formData.carbs ||
            formData.Carbohydrates ||
            formData["Carbohydrates (g)"]
          }
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
          value={formData.sodium || formData.Sodium || formData["Sodium (mg)"]}
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
          value={
            formData.porpotionSize ||
            formData.Porpotion_Size ||
            formData["Portion Size (g)"]
          }
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
