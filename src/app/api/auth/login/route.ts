// FILE: app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Impor library untuk cookie

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password diperlukan." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection("users").findOne({ username: username });
    if (!user) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const payload = {
      userId: user._id,
      username: user.username,
      // Kita tambahkan role di sini, asumsikan user biasa.
      // Anda bisa menambahkan field 'role' di data user di MongoDB jika perlu.
      role: user.role || "user",
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET tidak dikonfigurasi di server.");
    }

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    // --- PERUBAHAN UTAMA DIMULAI DI SINI ---

    // 1. Buat cookie yang aman
    const serializedCookie = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: "/",
    });

    // 2. Buat respons JSON seperti biasa
    const response = NextResponse.json(
      { message: "Login berhasil" },
      { status: 200 }
    );

    // 3. Set cookie tersebut di header respons
    response.headers.set("Set-Cookie", serializedCookie);

    return response;
    // --- PERUBAHAN UTAMA SELESAI ---
  } catch (error) {
    console.error("Login API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
