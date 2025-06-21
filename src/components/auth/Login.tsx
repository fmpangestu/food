"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const callbackUrl = searchParams.get("callbackUrl") || "/formFood";

    try {
      // Gunakan fungsi signIn dari NextAuth, ini akan memanggil API NextAuth
      const result = await signIn("credentials", {
        redirect: false, // Penting: kita akan handle redirect secara manual
        username: username,
        password: password,
        loginType: "user", // Tandai ini sebagai login user
      });

      if (result?.error) {
        // Tangkap pesan error dari 'authorize' di backend
        throw new Error(result.error);
      }

      toast.success("Login berhasil! Mengarahkan...");
      window.location.href = callbackUrl; // Hard redirect untuk memastikan sesi baru terbaca
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">Selamat Datang!</h1>
        <p className="mt-2 text-gray-600">Masuk untuk melanjutkan.</p>
      </div>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username-login"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username-login"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="password-login"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password-login"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Memuat..." : "Masuk"}
          </button>
        </div>
      </form>
    </>
  );
}
