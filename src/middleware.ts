import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Jangan memblokir endpoint auth dan API nya
  if (
    path.startsWith("/api/auth") ||
    path.includes("_next") ||
    path === "/login"
  ) {
    return NextResponse.next();
  }

  // Cek jika mencoba mengakses halaman admin
  if (path.startsWith("/admin")) {
    console.log("Protecting admin path:", path);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Log untuk debugging
    console.log("Auth token:", token ? "Found" : "Not found");
    if (token) console.log("Token role:", token.role);

    // Jika tidak ada token atau bukan admin, redirect ke login
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", path);
      console.log("Redirecting to:", url.toString());
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher dengan lebih spesifik - JANGAN block auth endpoints
export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
