/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb_atlas"; // Pastikan path ini benar
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
const ADMINS = [
  {
    email: "admin@gmail.com",
    password: "sukasehat", // Untuk produksi, gunakan hash atau variabel env
    name: "Admin",
    role: "admin",
    birthDate: "2000-01-01",
    gender: "male",
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
              birthDate: adminUser.birthDate,
              gender: adminUser.gender,
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
            birthDate: user.birthDate || "",
            gender: user.gender || "",
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
    async jwt({ token, user, trigger, session }) {
      // Saat login, isi token dari user
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.birthDate = user.birthDate;
        token.gender = user.gender;
        token.name = user.name;
        token.email = user.email;
      }
      // Saat update profile (trigger === "update"), update token dari session
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.birthDate) token.birthDate = session.birthDate;
        if (session.gender) token.gender = session.gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.email && token.role === "admin") {
        // Admin statis - pakai data dari token
        if (session.user) {
          session.user.name = token.name as string;
          session.user.birthDate = token.birthDate as string;
          session.user.gender = token.gender as string;
          session.user.role = token.role as string;
          session.user.id = token.id as string;
          session.user.email = token.email as string;
        }
      } else {
        // User biasa - ambil dari database
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);
          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(token.id) });
          if (user && session.user) {
            session.user.name = user.username;
            session.user.birthDate = user.birthDate;
            session.user.gender = user.gender;
            session.user.role = user.role;
            session.user.id = user._id.toString();
          }
        } catch (error) {
          console.error("Error fetching user from database:", error);
          // Fallback ke data token jika error
          if (session.user) {
            session.user.name = token.name as string;
            session.user.role = token.role as string;
            session.user.id = token.id as string;
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Halaman login user
    error: "/", // Halaman jika terjadi error autentikasi
  },
};
