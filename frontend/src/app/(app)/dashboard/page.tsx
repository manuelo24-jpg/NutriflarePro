"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Dumbbell,
  Utensils,
  Users,
  ArrowRight,
  CheckCircle2,
  Flame,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";

// Mock data for the mini chart
const progressData = [
  { day: "L", weight: 75.5 },
  { day: "M", weight: 75.2 },
  { day: "X", weight: 75.0 },
  { day: "J", weight: 74.8 },
  { day: "V", weight: 74.9 },
  { day: "S", weight: 74.5 },
  { day: "D", weight: 74.2 },
];

function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `¡Buenos días, ${name}!`;
  if (hour < 20) return `¡Buenas tardes, ${name}!`;
  return `¡Buenas noches, ${name}!`;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.username ?? "Atleta";
  const greeting = getGreeting(displayName);

  return (
    <div className="space-y-6 pb-10">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            {greeting}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Aquí tienes un resumen de tu progreso y plan para hoy.
          </p>
        </div>
        <Link 
          href="/progress"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors group"
        >
          <Target className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-primary">
            Actualizar progreso
          </span>
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        
        {/* Main Hero Card - Spans 2 columns */}
        <div className="md:col-span-2 lg:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wider uppercase">En racha</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Día 5 consecutivo</h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              Estás manteniendo un ritmo excelente. Tu constancia te acercará a tus objetivos más rápido.
            </p>
            <Link 
              href="/routines" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-0.5"
            >
              <Dumbbell className="w-4 h-4" />
              Ver rutina de hoy
            </Link>
          </div>
        </div>

        {/* Nutrition Card */}
        <Link href="/nutrition" className="md:col-span-1 lg:col-span-1 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/80 backdrop-blur-xl p-6 relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-blue-500/40 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nutrición</h3>
            <p className="text-xs text-muted-foreground">Resumen de macros</p>
          </div>
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Proteína</span>
                <span className="text-blue-400 font-medium">120g / 150g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[80%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Calorías</span>
                <span className="text-white font-medium">1850 / 2200 kcal</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[84%]" />
              </div>
            </div>
          </div>
        </Link>

        {/* Mini Chart Card */}
        <Link href="/progress" className="md:col-span-1 lg:col-span-1 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-slate-900/80 backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-purple-500/40 transition-colors cursor-pointer">
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Peso (Últimos 7 días)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">74.2</span>
              <span className="text-xs text-emerald-400 font-medium">-1.3 kg</span>
            </div>
          </div>
          <div className="h-16 mt-4 -mx-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="weight" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Link>

        {/* Quick Links Section */}
        <Link href="/community" className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 to-slate-900/80 backdrop-blur-xl p-6 group hover:border-orange-500/40 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Comunidad</h3>
            <p className="text-xs text-muted-foreground mt-1">Descubre nuevas rutinas y planes.</p>
          </div>
        </Link>

        <Link href="/routines" className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 backdrop-blur-xl p-6 group hover:border-emerald-500/40 transition-all flex items-center gap-4 md:col-span-1 lg:col-span-1">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Mis Rutinas</h3>
            <p className="text-xs text-muted-foreground mt-1">Gestiona tus entrenamientos.</p>
          </div>
        </Link>
        
        {/* Onboarding / Tasks */}
        <div className="md:col-span-2 lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Tareas pendientes</h3>
          <div className="space-y-3">
            {[
              { label: "Registra tu peso de hoy", done: false, href: "/progress" },
              { label: "Completa tu rutina de Pierna", done: false, href: "/routines" },
              { label: "Planifica tus comidas de la semana", done: true, href: "/nutrition" },
            ].map((task, i) => (
              <Link key={i} href={task.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${task.done ? 'bg-primary/20 border-primary text-primary' : 'border-muted-foreground/30'}`}>
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-sm ${task.done ? 'text-muted-foreground line-through' : 'text-slate-200'}`}>
                  {task.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
