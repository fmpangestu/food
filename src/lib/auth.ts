/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb_atlas"; // Pastikan path ini benar
import bcrypt from "bcryptjs";
const ADMINS = [
  {
    email: "admin@gmail.com",
    password: "sukasehat", // Untuk produksi, gunakan hash atau variabel env
    name: "Admin",
    role: "admin",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        if (!credentials?.loginType) {
          throw new Error("Tipe login tidak ditemukan.");
        }

        // --- Logika untuk Login Admin (statis, sesuai cara Anda) ---
        if (credentials.loginType === "admin") {
          const adminUser = ADMINS.find(
            (admin) =>
              admin.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (adminUser && adminUser.password === credentials.password) {
            // Jika kredensial admin cocok, kembalikan objek admin
            return {
              id: adminUser.email,
              name: adminUser.name,
              email: adminUser.email,
              role: adminUser.role,
            };
          }
          // Jika login admin gagal, lempar error
          throw new Error("Email atau password Admin salah.");
        }

        // --- Logika untuk Login User Biasa (dari database) ---
        if (credentials.loginType === "user") {
          if (!credentials.username || !credentials.password) {
            throw new Error("Username dan password diperlukan.");
          }
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);

          const user = await db
            .collection("users")
            .findOne({ username: credentials.username });
          if (!user) {
            throw new Error("Username tidak ditemukan.");
          }
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordMatch) {
            throw new Error("Password salah.");
          }
          // Jika berhasil, kembalikan objek user
          return {
            id: user._id.toString(),
            name: user.username,
            email: null,
            role: user.role || "user",
          };
        }

        // Jika tipe login tidak dikenali
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Callback ini akan dijalankan untuk menambahkan 'role' ke dalam token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Callback ini akan dijalankan untuk menambahkan 'role' ke data sesi
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;

        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Halaman login user
    error: "/", // Halaman jika terjadi error autentikasi
  },
};
