// "use client";

// import { useState, useEffect } from "react";
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

// export default function EditFoodPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const foodId = decodeURIComponent(params.id);

//   const [formData, setFormData] = useState<FoodFormData>({
//     name: "",
//     calories: 0,
//     protein: 0,
//     fat: 0,
//     carbs: 0,
//     sodium: 0,
//     porpotionSize: 100,
//   });
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFood = async () => {
//       try {
//         const response = await fetch(
//           `/api/foods/${encodeURIComponent(foodId)}`
//         );

//         if (!response.ok) {
//           throw new Error("Food not found");
//         }

//         const food = await response.json();
//         setFormData(food);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFood();
//   }, [foodId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "name" ? value : parseFloat(value) || 0,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     try {
//       const response = await fetch(`/api/foods/${encodeURIComponent(foodId)}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Failed to update food");
//       }

//       router.push("/admin");
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading food data...</div>;
//   if (error && !submitting)
//     return <div className="p-8 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Edit Food: {foodId}</h1>

//       {error && submitting && (
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
//             disabled={submitting}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             {submitting ? "Updating..." : "Update Food"}
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
