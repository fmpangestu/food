/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Augment (perluas) tipe data default dari NextAuth
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }

  interface Session extends DefaultSession {
    user?: {
      id?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    id?: string;
  }
}
