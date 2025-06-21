// "use client";

// interface FormData {
//   weight: string;
//   height: string;
//   age: string;
//   gender: string;
//   activityLevel: string;
// }

// interface RecommendationFormProps {
//   formData: FormData;
//   isLoading: boolean;
//   handleInputChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => void;
//   handleSubmit: (e: React.FormEvent) => void;
// }

// export default function RecommendationForm({
//   formData,
//   isLoading,
//   handleInputChange,
//   handleSubmit,
// }: RecommendationFormProps) {
//   return (
//     <div className="md:container mx-2 md:mx-auto p-6 text-white bg-gradient-to-tr from-blue-500 to-green-500 mt-4 rounded-xl">
//       <h1 className="text-2xl font-bold mb-4">Rekomendasi Makanan Sehat</h1>
//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label className="block mb-2" htmlFor="weight">
//             Berat Badan (kg)
//           </label>
//           <input
//             type="number"
//             id="weight"
//             name="weight"
//             value={formData.weight}
//             onChange={handleInputChange}
//             className="text-[#0d1821] bg-white rounded-lg p-2 w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2" htmlFor="height">
//             Tinggi Badan (cm)
//           </label>
//           <input
//             type="number"
//             id="height"
//             name="height"
//             value={formData.height}
//             onChange={handleInputChange}
//             className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2" htmlFor="age">
//             Usia (tahun)
//           </label>
//           <input
//             type="number"
//             id="age"
//             name="age"
//             value={formData.age}
//             onChange={handleInputChange}
//             className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2" htmlFor="gender">
//             Jenis Kelamin
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleInputChange}
//             className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
//           >
//             <option value="male">Laki-laki</option>
//             <option value="female">Perempuan</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-2" htmlFor="activityLevel">
//             Tingkat Aktivitas
//           </label>
//           <select
//             id="activityLevel"
//             name="activityLevel"
//             value={formData.activityLevel}
//             onChange={handleInputChange}
//             className="text-[#0d1821] outline-[#0d1821] rounded-lg p-2 w-full"
//           >
//             <option value="sedentary">Sedentary (Minim aktivitas)</option>
//             <option value="light">
//               Ringan (Olahraga ringan 1-3 hari/minggu)
//             </option>
//             <option value="moderate">
//               Sedang (Olahraga moderat 3-5 hari/minggu)
//             </option>
//             <option value="active">
//               Aktif (Olahraga intensif 6-7 hari/minggu)
//             </option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           className=" bg-transparent border-2 border-sky-200 font-semibold w-full text-white py-2 px-4 rounded"
//           disabled={isLoading}
//         >
//           {isLoading ? "Menghitung..." : "Dapatkan Rekomendasi"}
//         </button>
//       </form>
//     </div>
//   );
// }
