// import clientPromise from "@/lib/mongo";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const {
//       weight,
//       height,
//       age,
//       gender,
//       activityLevel,
//     }: {
//       weight: number;
//       height: number;
//       age: number;
//       gender: string;
//       activityLevel: "sedentary" | "light" | "moderate" | "active";
//     } = await req.json();
//     console.log("Request Body:", {
//       weight,
//       height,
//       age,
//       gender,
//       activityLevel,
//     });

//     // Hitung BMR
//     const bmr =
//       gender === "male"
//         ? 10 * weight + 6.25 * height - 5 * age + 5
//         : 10 * weight + 6.25 * height - 5 * age - 161;

//     // Hitung TDEE
//     const activityMultiplier =
//       {
//         sedentary: 1.2,
//         light: 1.375,
//         moderate: 1.55,
//         active: 1.725,
//       }[activityLevel] || 1.2;

//     const tdee = bmr * activityMultiplier;

//     // Tentukan Calorie Goal berdasarkan TDEE
//     let calorieGoal;
//     let calorieFilterCondition;
//     if (tdee < 2000) {
//       calorieGoal = tdee - 300; // Defisit 300 kalori
//       calorieFilterCondition = { calories: { $lte: calorieGoal } }; // Defisit kalori
//     } else if (tdee > 2500) {
//       calorieGoal = tdee + 300; // Surplus 300 kalori
//       calorieFilterCondition = { calories: { $gte: calorieGoal } }; // Surplus kalori
//     } else {
//       calorieGoal = tdee;
//       calorieFilterCondition = { calories: { $lte: calorieGoal } }; // Kalori sesuai dengan kebutuhan
//     }

//     // Koneksi ke database dan filter makanan berdasarkan kebutuhan kalori
//     const client = await clientPromise;
//     const db = client.db("healthy_food_recommendation"); // Pastikan nama database sesuai
//     const foods = await db
//       .collection("foods") // Pastikan koleksi ini ada
//       .find(calorieFilterCondition) // Filter berdasarkan kalori
//       .limit(10)
//       .toArray();

//     console.log("Calorie Goal:", calorieGoal);
//     console.log("Filtered Foods:", foods);

//     // Menyimpan rekomendasi ke koleksi 'recommendations'
//     const recommendations = {
//       weight,
//       height,
//       age,
//       gender,
//       activityLevel,
//       calorieGoal,
//       recommendedFoods: foods, // Simpan makanan yang direkomendasikan
//       createdAt: new Date(),
//     };

//     const result = await db
//       .collection("recommendations")
//       .insertOne(recommendations);
//     console.log("Recommendation inserted:", result);

//     // Mengirimkan hasil ke klien
//     return NextResponse.json({ foods, recommendations });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json(
//       { message: "Terjadi kesalahan.", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      weight,
      height,
      age,
      gender,
      activityLevel,
    }: {
      weight: number;
      height: number;
      age: number;
      gender: string;
      activityLevel: "sedentary" | "light" | "moderate" | "active";
    } = await req.json();

    // Hitung BMR
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultiplier =
      {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
      }[activityLevel] || 1.2;

    const tdee = bmr * activityMultiplier;

    // Tentukan kategori
    let goalCategory: string;
    if (tdee < 2000) {
      goalCategory = "gain_weight";
    } else if (tdee > 2500) {
      goalCategory = "lose_weight";
    } else {
      goalCategory = "maintenance";
    }

    // Ambil makanan berdasarkan kategori
    const client = await clientPromise;
    const db = client.db("healthy_food_recommendation");

    const foods = await db
      .collection("foods")
      .find({ goalCategory })
      .limit(10)
      .toArray();

    return NextResponse.json({ foods });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan.", error: error.message },
      { status: 500 }
    );
  }
}
