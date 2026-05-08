import Link from "next/link";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <AuthRedirect />
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full bg-cyan-500/6 blur-[140px]" />
        <div className="absolute -bottom-60 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-primary-foreground font-black text-sm">N</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Nutri<span className="text-primary">Flare</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.4)]"
          >
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Plataforma de fitness y nutrición todo en uno
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.0] mb-7">
          Entrena mejor,{" "}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-400">
            come inteligente
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Crea tus rutinas de gimnasio, planifica tu alimentación semanal y
          registra tu progreso. Todo centralizado, sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-28">
          <Link
            href="/register"
            className="group px-9 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-[0_0_36px_rgba(34,197,94,0.45)] hover:-translate-y-0.5 transform flex items-center gap-2"
          >
            Crear cuenta gratis
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/login"
            className="px-9 py-4 rounded-xl border border-border bg-white/5 text-foreground font-semibold text-base hover:border-primary/40 hover:bg-white/8 transition-all"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto text-left">
          {[
            {
              icon: "🏋️",
              title: "Rutinas de Gimnasio",
              desc: "Organiza tus ejercicios por día de la semana. Añade series, repeticiones y descansos a cada ejercicio de tu rutina.",
              color: "from-primary/15 to-emerald-900/10",
              border: "border-primary/20",
              glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]",
            },
            {
              icon: "🥗",
              title: "Plan Nutricional",
              desc: "Planifica desayuno, comida, merienda y cena para cada día. Consulta calorías, proteínas, carbos y grasas de cada comida.",
              color: "from-blue-500/15 to-blue-900/10",
              border: "border-blue-500/20",
              glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]",
            },
            {
              icon: "📈",
              title: "Seguimiento de Progreso",
              desc: "Registra tu peso, grasa corporal, horas de sueño e hidratación diaria. Define tus objetivos y visualiza tu evolución.",
              color: "from-purple-500/15 to-purple-900/10",
              border: "border-purple-500/20",
              glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
            },
            {
              icon: "👥",
              title: "Comunidad",
              desc: "Descubre rutinas y planes nutricionales de otros usuarios. Valora el contenido y haz públicas tus propias creaciones.",
              color: "from-orange-500/15 to-orange-900/10",
              border: "border-orange-500/20",
              glow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.12)]",
            },
            {
              icon: "📄",
              title: "Exportar a PDF",
              desc: "Descarga tu rutina en PDF para llevarla al gimnasio sin necesidad de abrir la app. Formato limpio e imprimible.",
              color: "from-cyan-500/15 to-cyan-900/10",
              border: "border-cyan-500/20",
              glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]",
            },
            {
              icon: "🔒",
              title: "Seguro y Privado",
              desc: "Autenticación con JWT y tokens de refresco. Tus datos son privados por defecto — tú decides qué compartir con la comunidad.",
              color: "from-rose-500/15 to-rose-900/10",
              border: "border-rose-500/20",
              glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.12)]",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`relative p-6 rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.color} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-default ${feature.glow}`}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              En tres pasos tienes tu plan completo listo para empezar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

            {[
              {
                step: "01",
                icon: "✍️",
                title: "Regístrate",
                desc: "Crea tu cuenta gratuita con tu email y nombre de usuario. Sin tarjeta, sin compromisos.",
              },
              {
                step: "02",
                icon: "📋",
                title: "Diseña tu plan",
                desc: "Crea tus rutinas de entrenamiento y tu plan alimenticio para cada día de la semana.",
              },
              {
                step: "03",
                icon: "🎯",
                title: "Registra y mejora",
                desc: "Anota tu progreso diario y observa cómo evolucionas hacia tus objetivos semana a semana.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-4xl mb-5 relative z-10">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
                  Paso {item.step}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 py-24 text-center border-t border-border/40">
        <div className="max-w-3xl mx-auto px-8">
          <div className="p-12 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 blur-[80px] bg-primary/5 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
                ¿Listo para empezar?
              </h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Crea tu cuenta hoy. Gratis, sin límites de tiempo.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.45)] hover:-translate-y-0.5 transform"
              >
                Crear cuenta gratis
                <span>→</span>
              </Link>
              <p className="text-xs text-muted-foreground/50 mt-6">
                Sin tarjeta de crédito · Sin suscripción · Empieza en segundos
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/30 mt-16">
          © 2026 NutriFlare. Todos los derechos reservados.
        </p>
      </section>
    </main>
  );
}
