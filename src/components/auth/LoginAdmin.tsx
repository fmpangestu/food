// FILE: app/login/LoginForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Efek untuk menampilkan pesan error dari middleware
  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(errorMessage);
      toast.error(errorMessage);
      // Hapus parameter error dari URL agar tidak muncul terus
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        loginType: "admin",
        callbackUrl: "/admin",
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      // Tidak perlu router.push
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-screen bg-gray-100 mx-5 md:mx-0">
      <div className="hidden md:block w-full max-w-md">
        <Image
          src="/admin.svg"
          alt="Logo"
          width={400}
          height={400}
          className="mx-auto"
        />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-[0px_2px_8px_0.1px_#a0aec0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Admin Login</h1>
          <p className="mt-2 text-gray-600">Masuk untuk mengelola data.</p>
        </div>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-600"
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
      </div>
    </main>
  );
}
