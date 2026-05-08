"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthRedirect() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // Si tenemos token o usuario, redirigir al dashboard
    if (user || accessToken) {
      router.push("/dashboard");
    }
  }, [user, accessToken, router]);

  return null;
}
