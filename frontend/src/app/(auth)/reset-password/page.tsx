"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string().min(1, { message: "Confirma tu contraseña" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "success" | "error" | "invalid">("idle");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("El enlace de recuperación no es válido. Solicita uno nuevo.");
    }
  }, [token]);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) return;
    setIsLoading(true);
    setStatus("idle");
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: values.newPassword,
      });
      setMessage(res.data.message || "¡Contraseña restablecida correctamente!");
      setStatus("success");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message;
      setMessage(serverMsg || "El enlace ha expirado o es inválido. Solicita uno nuevo.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Crea una contraseña segura</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Elige una contraseña robusta para proteger tu cuenta y todo tu progreso en NutriFlare.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { icon: "✓", text: "Mínimo 6 caracteres" },
              { icon: "✓", text: "Combina letras y números" },
              { icon: "✓", text: "Usa caracteres especiales (!@#$)" },
            ].map((tip) => (
              <div key={tip.text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{tip.icon}</span>
                </div>
                <span className="text-sm text-muted-foreground">{tip.text}</span>
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
            <h1 className="text-3xl font-black text-foreground mb-2">Nueva contraseña</h1>
            <p className="text-muted-foreground text-sm">
              Elige una contraseña segura para tu cuenta NutriFlare.
            </p>
          </div>

          {status === "invalid" ? (
            /* Invalid token state */
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Enlace inválido</h3>
                <p className="text-muted-foreground text-sm">{message}</p>
              </div>
              <Link
                href="/forgot-password"
                className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.35)]"
              >
                Solicitar nuevo enlace
              </Link>
            </div>
          ) : status === "success" ? (
            /* Success state */
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">¡Contraseña actualizada!</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
                <p className="text-xs text-muted-foreground/60 mt-3">Redirigiendo al inicio de sesión en unos segundos...</p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.35)]"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* New password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-sm font-medium text-foreground">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("newPassword")}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {form.formState.errors.newPassword && (
                  <p className="text-xs text-red-400 mt-1">{form.formState.errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("confirmPassword")}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {status === "error" && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {message}{" "}
                  <Link href="/forgot-password" className="underline font-medium">
                    Solicitar uno nuevo
                  </Link>
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
                    Actualizando contraseña...
                  </span>
                ) : (
                  "Restablecer contraseña"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
