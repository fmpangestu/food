// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// // interface Food {
// //     name: string;
// //     category: string;
// //     calories: number;
// //     protein: number;
// //     preparation: string;
// //   }

// const FoodList = () => {
//   const [foods, setFoods] = useState<any>([]);
//   const [error, setError] = useState("");
//   const [maxCalories, setMaxCalories] = useState("");
//   const [category, setCategory] = useState("");

//   const fetchFoods = async (query = "") => {
//     try {
//       const res = await fetch(`/api/foods${query}`);
//       const data = await res.json();

//       if (res.ok) {
//         setFoods(data);
//       } else {
//         setError(data.error || "Failed to fetch foods");
//       }
//     } catch (err) {
//       setError("An error occurred");
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const query = `?maxCalories=${maxCalories}&category=${category}`;
//     fetchFoods(query);
//   };

//   useEffect(() => {
//     fetchFoods();
//   }, []);

//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Rekomendasi Makanan</h1>
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div>
//           <label htmlFor="maxCalories">Kalori Maksimal:</label>
//           <input
//             type="number"
//             id="maxCalories"
//             value={maxCalories}
//             onChange={(e) => setMaxCalories(e.target.value)}
//             className="border p-2"
//           />
//         </div>
//         <div>
//           <label htmlFor="category">Kategori:</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="border p-2"
//           >
//             <option value="">Semua</option>
//             <option value="hewani">Hewani</option>
//             <option value="nabati">Nabati</option>
//           </select>
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//           Cari
//         </button>
//       </form>
//       <ul>
//         {foods.map(
//           (food: {
//             name: string;
//             category: string;
//             calories: number;
//             protein: number;
//             preparation: string;
//           }) => (
//             <li key={food.name}>
//               <h2>{food.name}</h2>
//               <p>Kategori: {food.category}</p>
//               <p>Kalori: {food.calories} kcal</p>
//               <p>Protein: {food.protein} g</p>
//               <p>Penyajian: {food.preparation}</p>
//             </li>
//           )
//         )}
//       </ul>
//     </div>
//   );
// };

// export default FoodList;
