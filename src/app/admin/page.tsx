/* eslint-disable @typescript-eslint/no-unused-vars */
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
import UserList from "@/components/user/UserList";
import { User } from "@/types/user";
import { toast } from "sonner";

export default function AdminPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"foods" | "users">("foods");

  useEffect(() => {
    // ...existing code fetchFoods...
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
        toast("User berhasil dihapus!");
      } else {
        alert(result.message || "Gagal hapus user");
      }
    } catch (err) {
      alert("Terjadi error saat hapus user");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-[#0D4715] items-center justify-center flex h-screen">
        Loading foods...
      </div>
    );
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      {activeTab === "foods" ? (
        <>
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
        </>
      ) : (
        ""
      )}
      {/* <div className="flex gap-2 mb-4 min-w-full  justify-center items-center">
        <button
          className={`px-4 py-1 w-full rounded ${
            activeTab === "foods" ? "bg-green-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("foods")}
        >
          Data Makanan
        </button>
        <button
          className={`px-4 py-1 w-full rounded ${
            activeTab === "users" ? "bg-green-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Data User
        </button>
      </div> */}
      {activeTab === "foods" ? (
        <>
          {/* ...existing code... */}
          <FoodList initialFoods={foods || lastFetched} />
        </>
      ) : (
        <UserList users={users} handleDelete={handleDelete} />
      )}
      <p className="text-center mt-4 text-[10px] text-gray-400 italic">
        @2025 -by data fatsecret Indonesia
      </p>
    </div>
  );
}
