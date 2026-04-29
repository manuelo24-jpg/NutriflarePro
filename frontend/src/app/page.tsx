import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">NutriFlare</span>
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
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]"
          >
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Plataforma de fitness y nutrición todo en uno
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05] mb-6">
          Transforma tu cuerpo,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-400">
            potencia tu vida
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Rutinas de gimnasio personalizadas, planificación nutricional semanal y seguimiento de progreso.
          Todo en un solo lugar, diseñado para que alcances tus metas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transform"
          >
            Comenzar ahora — es gratis
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl border border-border bg-surface/50 text-foreground font-semibold text-base hover:border-primary/50 hover:bg-surface transition-all"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-20">
          {[
            { value: "500+", label: "Ejercicios disponibles" },
            { value: "200+", label: "Planes nutricionales" },
            { value: "10k+", label: "Usuarios activos" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: "🏋️",
              title: "Rutinas de Gimnasio",
              desc: "Crea y gestiona rutinas por día de la semana. Más de 500 ejercicios con videos, grupos musculares y niveles de dificultad.",
              color: "from-primary/20 to-emerald-900/20",
              border: "border-primary/20",
            },
            {
              icon: "🥗",
              title: "Plan Nutricional",
              desc: "Planifica desayuno, comida, merienda y cena cada día. Visualiza macros y calorías en tiempo real.",
              color: "from-blue-500/20 to-blue-900/20",
              border: "border-blue-500/20",
            },
            {
              icon: "📈",
              title: "Seguimiento de Progreso",
              desc: "Registra tu peso, grasa corporal, sueño e hidratación. Gráficas interactivas y comparativa con tus objetivos.",
              color: "from-purple-500/20 to-purple-900/20",
              border: "border-purple-500/20",
            },
            {
              icon: "👥",
              title: "Comunidad",
              desc: "Descubre y copia rutinas y planes de otros usuarios. Valora el contenido y comparte tus creaciones.",
              color: "from-orange-500/20 to-orange-900/20",
              border: "border-orange-500/20",
            },
            {
              icon: "📄",
              title: "Exportar PDF",
              desc: "Descarga tus rutinas en PDF para llevarlas al gimnasio sin necesidad de tener el móvil.",
              color: "from-cyan-500/20 to-cyan-900/20",
              border: "border-cyan-500/20",
            },
            {
              icon: "🔒",
              title: "Seguro y Privado",
              desc: "Autenticación JWT con tokens de refresco, cifrado bcrypt y control total sobre tu privacidad.",
              color: "from-rose-500/20 to-rose-900/20",
              border: "border-rose-500/20",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`relative p-6 rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.color} backdrop-blur-sm text-left hover:scale-[1.02] transition-transform cursor-default`}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 py-20 text-center border-t border-border/50">
        <h2 className="text-4xl font-black text-foreground mb-4">
          Listo para empezar?
        </h2>
        <p className="text-muted-foreground mb-8">Únete y empieza a transformar tu cuerpo hoy.</p>
        <Link
          href="/register"
          className="inline-flex px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transform"
        >
          Crear cuenta gratis
        </Link>
      </section>
    </main>
  );
}
