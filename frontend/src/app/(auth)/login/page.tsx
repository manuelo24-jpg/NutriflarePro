"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", values);
      setAccessToken(res.data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Algo salió mal. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px]" />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-r border-border/30">
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">NutriFlare</span>
        </Link>

        <div className="z-10">
          <blockquote className="space-y-4">
            <p className="text-2xl font-bold text-foreground leading-snug">
              "La disciplina es el puente entre tus metas y tus logros."
            </p>
            <footer className="text-muted-foreground text-sm">— Jim Rohn</footer>
          </blockquote>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: "🏋️", label: "Rutinas de Gym" },
              { icon: "🥗", label: "Planes Nutricionales" },
              { icon: "📈", label: "Seguimiento de Progreso" },
              { icon: "👥", label: "Comunidad Activa" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-border/30">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 z-10">© 2026 NutriFlare. Todos los derechos reservados.</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NutriFlare</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">Bienvenido de nuevo</h1>
            <p className="text-muted-foreground">Inicia sesión para continuar tu progreso</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...form.register("email")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-400 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
