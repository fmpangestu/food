/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Trash2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

function getTotalCalories(arr: any[] = []) {
  return arr.reduce((sum, f) => sum + (f.calories || 0), 0);
}
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  const fetchHistory = async () => {
    setLoading(true);
    const res = await fetch("/api/history");
    const data = await res.json();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchHistory();
  };

  const handleClearAll = async () => {
    await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clearAll: true }),
    });
    fetchHistory();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:container md:mx-auto">
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Riwayat Pilihan Makanan
        </h1>
        <button
          className="px-2 md:px-4 py-1 md:py-2 bg-red-500 text-white rounded"
          onClick={handleClearAll}
        >
          Hapus Semua
        </button>
      </div>
      {loading ? (
        <p>Memuat...</p>
      ) : history.length === 0 ? (
        <>
          <div>
            <Image
              width={400}
              height={400}
              src="/undraw.svg"
              alt="sorry not history"
            />
            <p className="text-gray-600 text-center mt-5 ">
              Belum ada riwayat.
            </p>
          </div>
          <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
            <button
              className="w-[90%] max-w-full rounded-lg shadow bg-[#E9762B] text-white py-2 flex items-center justify-center"
              onClick={() => router.push("/formFood")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </button>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto w-full shadow rounded-md bg-[#f5f5f5] mb-20 ">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-[10px] p-2 md:text-sm md:p-2">No</th>
                <th className="text-[10px] p-2 md:text-sm md:p-2">Tanggal</th>
                <th className="text-[10px] p-2 md:text-sm md:p-2">
                  Total Kalori Makanan
                </th>
                <th className="text-[10px] p-2 md:text-sm md:p-2">Catatan</th>
                <th className="text-[10px] p-2 md:text-sm md:p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => {
                const total =
                  getTotalCalories(item.selectedFoods?.breakfast) +
                  getTotalCalories(item.selectedFoods?.lunch) +
                  getTotalCalories(item.selectedFoods?.dinner);
                return (
                  <React.Fragment key={item._id}>
                    <tr
                      className="text-xs md:text-sm cursor-pointer hover:bg-[#e6e6e6] transition h-10"
                      onClick={() =>
                        setExpanded(expanded === item._id ? null : item._id)
                      }
                    >
                      <td className="text-center">{idx + 1}</td>
                      <td className="text-center">
                        {item.createdAt
                          ? formatDate(item.createdAt)
                          : `${new Date(
                              Date.now() - idx * 86400000
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}`}
                      </td>
                      <td className="text-center">{total} kcal</td>
                      <td className="max-w-[100px] truncate">
                        {item.summaryInfo?.note || "-"}
                      </td>
                      <td className="relative flex items-center justify-center gap-2 top-2 ">
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <span className="hidden md:block right-3  absolute">
                          {expanded === item._id ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </span>
                      </td>
                    </tr>
                    {expanded === item._id && (
                      <tr
                        style={{
                          animation: "fadeInDown 0.7s cubic-bezier(.4,0,.2,1)",
                        }}
                      >
                        <td colSpan={5} className="bg-white p-4">
                          <div className="mb-2 text-sm text-[#0D4715]">
                            <b>Catatan:</b> {item.summaryInfo?.note || "-"}
                          </div>
                          <div className="mb-2 text-xs text-gray-600">
                            <b>Berat Badan :</b> {item.formData?.weight} kg |
                            <b>Kebutuhan Kalori:</b>{" "}
                            {item.summaryInfo?.calorieNeeds} kcal |
                            <b> Protein:</b>{" "}
                            {item.summaryInfo?.dailyProteinNeeds}g |
                            <b> Gula:</b>{" "}
                            {Number(item.summaryInfo?.dailySugarNeeds).toFixed(
                              2
                            )}
                            g |<b> Sodium:</b>{" "}
                            {item.summaryInfo?.dailySodiumNeeds}mg |
                            <b> Karbo:</b> {item.summaryInfo?.dailyCarbsNeeds}g
                            |<b> Lemak Jenuh:</b>{" "}
                            {item.summaryInfo?.saturedFatLimit}g
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {["breakfast", "lunch", "dinner"].map((meal) => (
                              <div
                                key={meal}
                                className="border rounded p-2 bg-[#f5f5f5]"
                              >
                                <div className="font-semibold capitalize mb-1">
                                  {meal === "breakfast"
                                    ? "Sarapan"
                                    : meal === "lunch"
                                    ? "Makan Siang"
                                    : "Makan Malam"}
                                </div>
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="flex justify-between">
                                      <th>Nama</th>
                                      <th className="translate-x-full">
                                        Kalori
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.selectedFoods?.[meal]?.length ? (
                                      item.selectedFoods[meal].map(
                                        (f: any, i: number) => (
                                          <tr key={i}>
                                            <td>{f.name}</td>
                                            <td>{f.calories} kcal</td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={2}
                                          className="text-center text-gray-400"
                                        >
                                          Tidak ada data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td className="font-bold">Total</td>
                                      <td className="font-bold">
                                        {getTotalCalories(
                                          item.selectedFoods?.[meal]
                                        )}{" "}
                                        kcal
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
        <button
          className="w-[90%] max-w-full rounded-lg shadow bg-[#004030] text-white py-2 flex items-center justify-center"
          onClick={() => router.push("/formFood")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </button>
      </div>
    </div>
  );
}
