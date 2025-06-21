import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dapatkan token sesi. Fungsi ini akan bekerja untuk admin dan user
  // jika keduanya login menggunakan sistem NextAuth.
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Pastikan variabel ini ada di .env.local
  });

  // ===================================================================
  // ATURAN 1: Melindungi Halaman Admin (Logika Asli Anda yang sudah berhasil)
  // ===================================================================
  if (pathname.startsWith("/admin")) {
    // Jika tidak ada token ATAU rolenya bukan 'admin',
    // maka arahkan ke halaman login admin di /login.
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "Akses Admin Ditolak");
      return NextResponse.redirect(url);
    }
  }

  // ===================================================================
  // ATURAN 2: Melindungi Halaman Pengguna (Contoh: /formFood)
  // ===================================================================
  const userProtectedPaths = ["/formFood", "/rekomendasi"];

  if (userProtectedPaths.some((p) => pathname.startsWith(p))) {
    // Jika tidak ada token sama sekali (siapa pun itu, admin atau user, belum login),
    // maka arahkan ke halaman login user di '/'.
    if (!token) {
      const url = new URL("/", request.url);
      url.searchParams.set("callbackUrl", pathname); // Simpan tujuan awal

      // -- INI BAGIAN YANG DIPERBAIKI --
      // Anda harus me-redirect, bukan melanjutkan dengan next().
      return NextResponse.redirect(url);
    }
  }

  // Jika lolos dari semua aturan di atas, izinkan pengguna untuk melanjutkan.
  return NextResponse.next();
}

// ===================================================================
// KONFIGURASI MATCHER (URL mana saja yang akan memicu middleware ini)
// ===================================================================
export const config = {
  matcher: [
    // Jalankan middleware untuk semua path di bawah /admin
    "/admin/:path*",
    // Jalankan middleware untuk /formFood
    "/formFood/:path*",
    // Jalankan middleware untuk /rekomendasi
    "/rekomendasi/:path*",
  ],
};
