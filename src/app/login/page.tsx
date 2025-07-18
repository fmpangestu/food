// FILE: app/login/page.tsx
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginAdmin";

export default function AdminLogin() {
  return (
    <Suspense fallback={<div>Memuat login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
