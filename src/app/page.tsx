/* eslint-disable @typescript-eslint/no-unused-vars */
// FILE: app/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react"; // Impor useSession
import { useRouter } from "next/navigation"; // Impor useRouter
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Image from "next/image";

function LoadingSpinner() {
  return <div className="text-center p-4">Memuat...</div>;
}

export default function AuthPage() {
  // State untuk beralih antara form login dan register
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Gunakan useSession untuk mendapatkan status login pengguna
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika status sudah 'authenticated' (artinya pengguna sudah login),
    // langsung arahkan ke halaman rekomendasi.
    if (status === "authenticated") {
      router.push("/formFood");
    }
  }, [status, router]); // Jalankan efek ini setiap kali status berubah

  // Selama sesi masih dicek (loading), tampilkan pesan loading
  // Ini mencegah form login "berkedip" sebelum redirect
  if (status === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        Memeriksa sesi...
      </main>
    );
  }

  // Hanya tampilkan form login/register jika statusnya 'unauthenticated'
  if (status === "unauthenticated") {
    return (
      <main className=" flex flex-col md:flex-row gap-10 items-center justify-center min-h-screen bg-gray-100 p-4 ">
        <div className="hidden md:block w-full max-w-md">
          <Image
            src="/healthy.svg"
            alt="Logo"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
        <div className="w-full max-w-md ">
          {/* Tombol untuk beralih mode */}
          <div className="flex gap-1 w-full mb-2 rounded-lg bg-gray-200 p-1 shadow-[0px_1px_6px_0.1px_#a0aec0]">
            <button
              onClick={() => setAuthMode("login")}
              className={`w-full p-0.5 rounded-md text-sm font-medium transition-colors ${
                authMode === "login"
                  ? "bg-white text-green-600 shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-300"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={`w-full p-0.5 rounded-md text-sm font-medium transition-colors ${
                authMode === "register"
                  ? "bg-white text-green-600 shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-300"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form Container */}
          <div className="relative w-full p-8 space-y-8 bg-white rounded-lg shadow-[0px_1px_6px_0.1px_#a0aec0]">
            <Image
              src="/healthy.svg"
              alt="Logo"
              width={170}
              height={170}
              className="md:hidden absolute left-[10%]  -translate-y-5"
            />
            <Suspense fallback={<LoadingSpinner />}>
              {authMode === "login" ? <Login /> : <Register />}
            </Suspense>
          </div>
        </div>
      </main>
    );
  }

  // Fallback jika terjadi status lain atau saat redirect
  return null;
}
