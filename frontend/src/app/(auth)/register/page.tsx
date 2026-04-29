"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import Link from "next/link";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", values);
      setAccessToken(res.data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px]" />
      </div>

      {/* Left panel — form */}
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
            <h1 className="text-3xl font-black text-foreground mb-2">Crea tu cuenta</h1>
            <p className="text-muted-foreground">Empieza tu transformación hoy, completamente gratis</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                {...form.register("username")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
              />
              {form.formState.errors.username && (
                <p className="text-xs text-red-400 mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
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
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta gratis"
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Al registrarte aceptas nuestros{" "}
              <span className="text-primary cursor-pointer hover:underline">Términos de servicio</span>{" "}
              y{" "}
              <span className="text-primary cursor-pointer hover:underline">Política de privacidad</span>
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-bl from-primary/5 via-transparent to-transparent border-l border-border/30">
        <Link href="/" className="flex items-center gap-2 z-10 justify-end">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">NutriFlare</span>
        </Link>

        <div className="z-10 space-y-6">
          <h2 className="text-3xl font-black text-foreground leading-tight">
            Todo lo que necesitas<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              para transformarte
            </span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: "✅", text: "Rutinas de gym personalizadas por día de semana" },
              { icon: "✅", text: "Planes alimenticios con resumen nutricional" },
              { icon: "✅", text: "Gráficas de progreso en peso, grasa y más" },
              { icon: "✅", text: "Comunidad para compartir y valorar contenido" },
              { icon: "✅", text: "Exportar rutinas a PDF para el gimnasio" },
              { icon: "✅", text: "100% gratis para empezar" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="p-5 rounded-2xl bg-white/5 border border-border/30 mt-6">
            <p className="text-sm text-foreground leading-relaxed mb-3">
              "Llevo 3 meses usando NutriFlare y he perdido 8kg siguiendo mis rutinas y el plan de alimentación. La app es increíble."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">A</div>
              <div>
                <div className="text-xs font-semibold text-foreground">Alejandro M.</div>
                <div className="text-xs text-muted-foreground">Usuario desde enero 2026</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 z-10 text-right">© 2026 NutriFlare. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
