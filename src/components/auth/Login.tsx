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

  // Forgot/reset password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Login submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const trimmedUsername = username.trim();
    const callbackUrl = searchParams.get("callbackUrl") || "/formFood";

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: trimmedUsername,
        password: password,
        loginType: "user",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Login berhasil! Tunggu sebentar...");
      window.location.href = callbackUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  // Forgot password submit (cek username)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Cek username di database (opsional, bisa skip API jika tidak perlu validasi)
    if (!forgotUsername) {
      toast.error("Username wajib diisi");
      return;
    }
    // Verifikasi username ke backend
    const res = await fetch("/api/auth/check-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: forgotUsername }),
    });
    const data = await res.json();
    if (res.ok && data.exists) {
      setShowResetForm(true);
    } else {
      toast.error("Username tidak ditemukan");
    }
  };

  // Reset password submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forgotUsername,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password berhasil direset! Silakan login.");
        setShowForgot(false);
        setShowResetForm(false);
        setForgotUsername("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Gagal reset password");
      }
    } catch {
      toast.error("Gagal reset password");
    }
  };

  return (
    <>
      <div className="text-center z-[999]">
        <h1 className="text-2xl font-bold text-green-600">Selamat Datang!</h1>
        <p className="mt-2 text-gray-600">Masuk untuk melanjutkan.</p>
      </div>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* LOGIN FORM */}
      {!showForgot && (
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
                className="absolute text-green-600 inset-y-0 right-0 pr-3 flex items-center "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p
              className="mt-4 text-sm text-green-600 cursor-pointer hover:underline text-end"
              onClick={() => {
                setShowForgot(true);
                setShowResetForm(false);
                setForgotUsername("");
                setNewPassword("");
              }}
            >
              Lupa Password?
            </p>
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
      )}

      {/* FORGOT PASSWORD: INPUT USERNAME */}
      {showForgot && !showResetForm && (
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Masukkan Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
              className="block w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded text-[10px] text-sm"
            >
              Ganti Password
            </button>
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => {
                setShowForgot(false);
                setShowResetForm(false);
                setForgotUsername("");
                setNewPassword("");
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* RESET PASSWORD FORM */}
      {showForgot && showResetForm && (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={forgotUsername}
              disabled
              className="block w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2 border rounded"
                required
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded"
            >
              Reset Password
            </button>
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => {
                setShowForgot(false);
                setShowResetForm(false);
                setForgotUsername("");
                setNewPassword("");
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </>
  );
}
