"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email({ message: "Introduce un email válido" }),
});

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    setIsLoading(true);
    setStatus("idle");
    try {
      const res = await api.post("/auth/forgot-password", values);
      setMessage(res.data.message || "Si el correo está registrado, recibirás un enlace de recuperación.");
      setStatus("success");
    } catch (err: any) {
      setMessage("Ocurrió un error. Por favor, inténtalo de nuevo.");
      setStatus("error");
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
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">¿Olvidaste tu acceso?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            No te preocupes, te enviaremos un enlace seguro a tu correo electrónico para que puedas restablecer tu contraseña en minutos.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { step: "1", text: "Introduce tu email registrado" },
              { step: "2", text: "Revisa tu bandeja de entrada" },
              { step: "3", text: "Crea una nueva contraseña segura" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{item.step}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.text}</span>
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
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio de sesión
            </Link>
            <h1 className="text-3xl font-black text-foreground mb-2">Recuperar contraseña</h1>
            <p className="text-muted-foreground text-sm">
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-6">
              {/* Success state */}
              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">¡Correo enviado!</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-border/40">
                <p className="text-xs text-muted-foreground text-center">
                  ¿No lo recibes? Revisa tu carpeta de spam o{" "}
                  <button
                    onClick={() => { setStatus("idle"); form.reset(); }}
                    className="text-primary hover:underline font-medium"
                  >
                    inténtalo de nuevo
                  </button>
                </p>
              </div>

              <Link
                href="/login"
                className="flex items-center justify-center w-full py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="tu@email.com"
                  {...form.register("email")}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              {status === "error" && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando enlace...
                  </span>
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Recordaste tu contraseña?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
