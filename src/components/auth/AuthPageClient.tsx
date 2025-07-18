/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/auth/AuthPageClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Image from "next/image";

function LoadingSpinner() {
  return <div className="text-center p-4">Memuat...</div>;
}

export default function AuthPageClient() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/formFood");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        Memeriksa sesi...
      </main>
    );
  }

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
          <div className="relative w-full p-8 space-y-8 bg-white rounded-lg shadow-[0px_1px_6px_0.1px_#a0aec0]">
            <Image
              src="/healthy.svg"
              alt="Logo"
              width={170}
              height={170}
              className="md:hidden absolute left-[10%]  -translate-y-5"
            />
            {/* Tidak usah pakai <Suspense> di sini! */}
            {authMode === "login" ? <Login /> : <Register />}
          </div>
        </div>
      </main>
    );
  }

  return null;
}
