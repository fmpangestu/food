// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// interface FoodFormData {
//   name: string;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   sodium: number;
//   porpotionSize: number;
// }

// export default function AddFoodPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FoodFormData>({
//     name: "",
//     calories: 0,
//     protein: 0,
//     fat: 0,
//     carbs: 0,
//     sodium: 0,
//     porpotionSize: 100,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "name" ? value : parseFloat(value) || 0,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/foods", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Failed to add food");
//       }

//       router.push("/admin");
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Add New Food</h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Calories</label>
//           <input
//             type="number"
//             name="calories"
//             value={formData.calories}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Protein (g)</label>
//           <input
//             type="number"
//             name="protein"
//             value={formData.protein}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             step="0.1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Fat (g)</label>
//           <input
//             type="number"
//             name="fat"
//             value={formData.fat}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             step="0.1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Carbs (g)</label>
//           <input
//             type="number"
//             name="carbs"
//             value={formData.carbs}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             step="0.1"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Sodium (mg)</label>
//           <input
//             type="number"
//             name="sodium"
//             value={formData.sodium}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Portion Size (g)</label>
//           <input
//             type="number"
//             name="porpotionSize"
//             value={formData.porpotionSize}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div className="flex gap-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             {loading ? "Adding..." : "Add Food"}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/admin")}
//             className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Food</h1>

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
