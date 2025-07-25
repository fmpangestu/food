import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb_atlas";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Trim username (hilangkan spasi awal/akhir)
    const trimmedUsername = (username || "").trim();

    if (!trimmedUsername || !password) {
      return NextResponse.json(
        { error: "Username dan password diperlukan." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Cek username yang sudah di-trim
    const existingUser = await db
      .collection("users")
      .findOne({ username: trimmedUsername });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan. Silakan pilih yang lain." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username: trimmedUsername, // Simpan yang sudah di-trim
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Registrasi berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
