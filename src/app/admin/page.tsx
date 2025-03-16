// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";

// interface Food {
//   name: string;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   sodium: number;
//   porpotionSize: number;
// }

// export default function AdminPage() {
//   const [foods, setFoods] = useState<Food[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchFoods = async () => {
//       try {
//         const response = await fetch("/api/foods");
//         if (!response.ok) throw new Error("Failed to fetch foods");

//         const data = await response.json();
//         setFoods(data);
//       } catch (err) {
//         setError("Error loading foods");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFoods();
//   }, []);

//   const handleDelete = async (foodName: string) => {
//     if (!confirm("Are you sure you want to delete this food?")) return;

//     try {
//       const response = await fetch(
//         `/api/foods/${encodeURIComponent(foodName)}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete food");

//       setFoods(foods.filter((food) => food.name !== foodName));
//     } catch (err) {
//       alert("Error deleting food");
//       console.error(err);
//     }
//   };

//   const filteredFoods = foods.filter((food) =>
//     food.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="p-8">Loading foods...</div>;
//   if (error) return <div className="p-8 text-red-500">{error}</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Food Management</h1>
//         <Link
//           href="/admin/add-food"
//           className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//         >
//           Add New Food
//         </Link>
//       </div>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search foods..."
//           className="w-full p-2 border rounded-md"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Calories</th>
//               <th className="border p-2">Protein (g)</th>
//               <th className="border p-2">Fat (g)</th>
//               <th className="border p-2">Carbs (g)</th>
//               <th className="border p-2">Sodium (mg)</th>
//               <th className="border p-2">Portion (g)</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredFoods.map((food) => (
//               <tr key={food.name}>
//                 <td className="border p-2">{food.name}</td>
//                 <td className="border p-2">{food.calories}</td>
//                 <td className="border p-2">{food.protein}</td>
//                 <td className="border p-2">{food.fat}</td>
//                 <td className="border p-2">{food.carbs}</td>
//                 <td className="border p-2">{food.sodium}</td>
//                 <td className="border p-2">{food.porpotionSize}</td>
//                 <td className="border p-2">
//                   <div className="flex space-x-2">
//                     <Link
//                       href={`/admin/edit-food/${encodeURIComponent(food.name)}`}
//                       className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-sm"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(food.name)}
//                       className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FoodList from "@/components/FoodList";
import { Food } from "@/types/food";

export default function AdminPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string>("");

  // useEffect(() => {
  //   const fetchFoods = async () => {
  //     try {
  //       const response = await fetch("/api/foods");
  //       if (!response.ok) throw new Error("Failed to fetch foods");

  //       const data = await response.json();

  //       const validatedData = Array.isArray(data)
  //         ? data.filter(
  //             (food) =>
  //               food &&
  //               typeof food === "object" &&
  //               typeof food.name === "string"
  //           )
  //         : [];

  //       setFoods(validatedData);
  //       // serFoods(data)
  //     } catch (err) {
  //       setError("Error loading foods");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFoods();
  // }, []);
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        console.log("Fetching foods from API...");

        // Tambahkan timestamp untuk mencegah cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/foods?t=${timestamp}`);

        if (!response.ok) throw new Error("Failed to fetch foods");

        const data = await response.json();
        console.log("Foods data received:", {
          type: typeof data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 0,
          sample: Array.isArray(data) && data.length > 0 ? data[0] : null,
        });

        // Validasi data sebelum update state
        if (Array.isArray(data)) {
          setFoods(data);
          setLastFetched(new Date().toLocaleTimeString());
        } else {
          console.error("API returned non-array data:", data);
          setFoods([]);
          setError("Data format error");
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Error loading foods");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleDelete = async (foodName: string) => {
    if (!confirm("Are you sure you want to delete this food?")) return;

    try {
      const response = await fetch(
        `/api/foods/${encodeURIComponent(foodName)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete food");

      setFoods(foods.filter((food) => food.name !== foodName));
    } catch (err) {
      alert("Error deleting food");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-[#00712D] items-center justify-center flex h-screen">
        Loading foods...
      </div>
    );
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Management data makanan</h1>
        <div className="flex gap-3 items-center justify-center">
          <Link
            href="/admin/add-food"
            className="bg-green-600 text-white text-[10px lg:text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-green-700"
          >
            Add data
          </Link>
          <Link
            href="/formFood"
            className="bg-green-600 text-white text-[10px lg:text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-green-700"
          >
            Form Perhitungan
          </Link>
        </div>
      </div>

      <FoodList
        foods={foods || lastFetched}
        setFoods={setFoods}
        handleDelete={handleDelete}
      />
    </div>
  );
}
