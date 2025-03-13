/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// Daftar admin yang diotorisasi
const ADMINS = [
  {
    email: "admin@gmail.com",
    password: "sukasehat", // Gunakan bcrypt di aplikasi produksi
    name: "Admin",
  },
];

export const authOptions: NextAuthOptions = {
  debug: true, // Aktifkan debugger untuk melihat lebih banyak detail error
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials", // Tambahkan ID eksplisit
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        console.log("Attempting login with:", credentials.email);
        // Tambahkan log untuk debugging, tapi jangan tampilkan password lengkap
        console.log("Password provided length:", credentials.password.length);

        // Cek kredensial dengan case insensitive untuk email
        const user = ADMINS.find(
          (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (user) {
          console.log("User found:", user.email);
          // Perbandingan password yang lebih aman
          if (user.password === credentials.password) {
            console.log("Login successful for:", user.email);
            return {
              id: user.email,
              name: user.name,
              email: user.email,
              role: "admin",
            };
          } else {
            console.log("Password incorrect for:", user.email);
          }
        } else {
          console.log("User not found with email:", credentials.email);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 hari
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
