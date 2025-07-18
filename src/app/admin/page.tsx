"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FoodList from "@/components/FoodList";
import { Food } from "@/types/food";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import GreetingTime from "@/components/AllertHallo";

export default function AdminPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

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
        const response = await fetch(`/api/fods?t=${timestamp}`);

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

  // const handleDelete = async (foodName: string) => {
  //   if (!confirm("Are you sure you want to delete this food?")) return;

  //   // try {
  //   //   const response = await fetch(
  //   //     `/api/foods/${encodeURIComponent(foodName)}`,
  //   //     {
  //   //       method: "DELETE",
  //   //     }
  //   //   );

  //   //   if (!response.ok) throw new Error("Failed to delete food");

  //   //   setFoods(foods.filter((food) => food.name !== foodName));
  //   // } catch (err) {
  //   //   alert("Error deleting food");
  //   //   console.error(err);
  //   // }
  // };

  if (loading)
    return (
      <div className="p-8 text-[#0D4715] items-center justify-center flex h-screen">
        Loading foods...
      </div>
    );
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">
          Management data makanan
        </h1>
        <div className="flex gap-3 items-center justify-center">
          <Link
            href="/admin/add-food"
            className="bg-[#0D4715] text-white text-[10px lg:text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-green-700"
          >
            Add data
          </Link>
          <Link
            href="/formFood"
            className="bg-[#0D4715] text-white text-[10px lg:text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-green-700"
          >
            Form Perhitungan
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow hover:bg-blue-800 transition">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 ">
              <div className="px-3 py-2  italic text-sm text-gray-700">
                <GreetingTime name={session?.user?.name || "Admin"} />
              </div>
              <div className="group">
                <DropdownMenuItem
                  onClick={() => {
                    signOut({ redirect: false });
                    router.push("/login");
                  }}
                  className=" cursor-pointer text-red-600 font-semibold  group-hover:text-white group-hover:bg-yellow-500 transform transition-all duration-1000 ease-in-out"
                >
                  <div className="flex justify-center items-center">
                    <LogOut className=" h-3 w-3 -translate-x-10 group-hover:translate-x-1/2  transition-all duration-1000 ease-in-out" />
                    <span className="-translate-x-4 group-hover:translate-x-1/2 transform transition-all duration-1000 ease-in-out">
                      Keluar
                    </span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <FoodList initialFoods={foods || lastFetched} />
    </div>
  );
}
