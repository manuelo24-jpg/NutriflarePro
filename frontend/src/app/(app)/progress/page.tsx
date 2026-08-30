"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Scale,
  Flame,
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  Moon,
  Droplets,
  Footprints,
  Ruler,
  Target,
  Plus,
  Calendar,
  Edit3,
  CheckCircle2,
  Zap,
  Brain,
  X,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressLog {
  id: string;
  date: string;
  weightKg: number | null;
  bodyFatPct: number | null;
  muscleMassKg: number | null;
  chestCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  armCm: number | null;
  thighCm: number | null;
  sleepHours: number | null;
  waterLiters: number | null;
  dailySteps: number | null;
  caloriesBurned: number | null;
  restingHeartRate: number | null;
  systolicBp: number | null;
  diastolicBp: number | null;
  energyLevel: number | null;
  stressLevel: number | null;
  notes: string | null;
}

interface ProgressGoal {
  id?: string;
  weightKg: number | null;
  bodyFatPct: number | null;
  muscleMassKg: number | null;
  chestCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  armCm: number | null;
  thighCm: number | null;
  sleepHours: number | null;
  waterLiters: number | null;
  dailySteps: number | null;
  caloriesBurned: number | null;
}

type MetricKey =
  | "weightKg"
  | "bodyFatPct"
  | "muscleMassKg"
  | "waistCm"
  | "chestCm"
  | "armCm"
  | "thighCm"
  | "dailySteps"
  | "sleepHours"
  | "waterLiters"
  | "caloriesBurned";

const METRIC_CONFIG: Record<
  MetricKey,
  { label: string; unit: string; color: string; gradientId: string; icon: any }
> = {
  weightKg: { label: "Peso", unit: "kg", color: "#c084fc", gradientId: "colorWeight", icon: Scale },
  muscleMassKg: { label: "Masa Muscular", unit: "kg", color: "#22c55e", gradientId: "colorMuscle", icon: Activity },
  bodyFatPct: { label: "% Grasa Corporal", unit: "%", color: "#f97316", gradientId: "colorFat", icon: Flame },
  waistCm: { label: "Cintura", unit: "cm", color: "#3b82f6", gradientId: "colorWaist", icon: Ruler },
  chestCm: { label: "Pecho", unit: "cm", color: "#ec4899", gradientId: "colorChest", icon: Ruler },
  armCm: { label: "Brazo", unit: "cm", color: "#a855f7", gradientId: "colorArm", icon: Ruler },
  thighCm: { label: "Muslo", unit: "cm", color: "#14b8a6", gradientId: "colorThigh", icon: Ruler },
  dailySteps: { label: "Pasos Diarios", unit: "pasos", color: "#10b981", gradientId: "colorSteps", icon: Footprints },
  sleepHours: { label: "Sueño", unit: "hrs", color: "#6366f1", gradientId: "colorSleep", icon: Moon },
  waterLiters: { label: "Agua", unit: "L", color: "#06b6d4", gradientId: "colorWater", icon: Droplets },
  caloriesBurned: { label: "Gasto Calórico", unit: "kcal", color: "#ef4444", gradientId: "colorCalories", icon: Flame },
};

export default function ProgressPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [goal, setGoal] = useState<ProgressGoal | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selected metric for chart
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("weightKg");

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"composition" | "measures" | "habits" | "vitals">("composition");

  // Form states
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weightKg: "",
    bodyFatPct: "",
    muscleMassKg: "",
    chestCm: "",
    waistCm: "",
    hipCm: "",
    armCm: "",
    thighCm: "",
    sleepHours: "",
    waterLiters: "",
    dailySteps: "",
    caloriesBurned: "",
    restingHeartRate: "",
    systolicBp: "",
    diastolicBp: "",
    energyLevel: "8",
    stressLevel: "3",
    notes: "",
  });

  const [goalForm, setGoalForm] = useState({
    weightKg: "",
    bodyFatPct: "",
    muscleMassKg: "",
    waistCm: "",
    sleepHours: "",
    waterLiters: "",
    dailySteps: "",
    caloriesBurned: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [logsRes, statsRes] = await Promise.all([
        api.get("/progress/logs?limit=30"),
        api.get("/progress/stats"),
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
      setGoal(statsRes.data.goal);

      if (statsRes.data.latest) {
        const l = statsRes.data.latest;
        setLogForm((prev) => ({
          ...prev,
          weightKg: l.weightKg?.toString() ?? "",
          bodyFatPct: l.bodyFatPct?.toString() ?? "",
          muscleMassKg: l.muscleMassKg?.toString() ?? "",
          chestCm: l.chestCm?.toString() ?? "",
          waistCm: l.waistCm?.toString() ?? "",
          hipCm: l.hipCm?.toString() ?? "",
          armCm: l.armCm?.toString() ?? "",
          thighCm: l.thighCm?.toString() ?? "",
          sleepHours: l.sleepHours?.toString() ?? "",
          waterLiters: l.waterLiters?.toString() ?? "",
          dailySteps: l.dailySteps?.toString() ?? "",
          caloriesBurned: l.caloriesBurned?.toString() ?? "",
          restingHeartRate: l.restingHeartRate?.toString() ?? "",
          systolicBp: l.systolicBp?.toString() ?? "",
          diastolicBp: l.diastolicBp?.toString() ?? "",
          energyLevel: l.energyLevel?.toString() ?? "8",
          stressLevel: l.stressLevel?.toString() ?? "3",
          notes: l.notes ?? "",
        }));
      }

      if (statsRes.data.goal) {
        const g = statsRes.data.goal;
        setGoalForm({
          weightKg: g.weightKg?.toString() ?? "",
          bodyFatPct: g.bodyFatPct?.toString() ?? "",
          muscleMassKg: g.muscleMassKg?.toString() ?? "",
          waistCm: g.waistCm?.toString() ?? "",
          sleepHours: g.sleepHours?.toString() ?? "",
          waterLiters: g.waterLiters?.toString() ?? "",
          dailySteps: g.dailySteps?.toString() ?? "",
          caloriesBurned: g.caloriesBurned?.toString() ?? "",
        });
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form handlers
  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload: any = { date: logForm.date };
      const keys = [
        "weightKg", "bodyFatPct", "muscleMassKg", "chestCm", "waistCm", "hipCm",
        "armCm", "thighCm", "sleepHours", "waterLiters", "dailySteps", "caloriesBurned",
        "restingHeartRate", "systolicBp", "diastolicBp", "energyLevel", "stressLevel"
      ];

      keys.forEach((key) => {
        const val = (logForm as any)[key];
        if (val !== "" && val !== null && val !== undefined) {
          payload[key] = parseFloat(val);
        }
      });
      if (logForm.notes) payload.notes = logForm.notes;

      await api.post("/progress/logs", payload);
      setIsLogModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload: any = {};
      Object.entries(goalForm).forEach(([k, v]) => {
        if (v !== "") payload[k] = parseFloat(v);
      });

      await api.post("/progress/goals", payload);
      setIsGoalModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving goal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recharts formatted data
  const chartData = logs
    .slice()
    .reverse()
    .map((log) => {
      const d = new Date(log.date);
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      return {
        date: dateStr,
        val: (log as any)[selectedMetric] ?? null,
      };
    });

  const latestLog = stats?.latest;
  const currentMetricConfig = METRIC_CONFIG[selectedMetric];

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Salud Física & Composición
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Control de Progreso
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Monitorea tu evolución muscular, medidas, constantes vitales y hábitos diarios.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/80 text-foreground font-semibold text-sm hover:bg-white/5 transition-all"
          >
            <Target className="w-4 h-4 text-primary" />
            Mis Metas
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Registrar Hoy
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Peso */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Peso Actual</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {latestLog?.weightKg ? `${latestLog.weightKg}` : "--"}
            </span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
          {stats?.weightChange !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              {stats.weightChange <= 0 ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> {stats.weightChange} kg
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{stats.weightChange} kg
                </span>
              )}
            </div>
          )}
        </div>

        {/* Masa Muscular */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Masa Muscular</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {latestLog?.muscleMassKg ? `${latestLog.muscleMassKg}` : "--"}
            </span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 mt-2 block">
            {goal?.muscleMassKg ? `Meta: ${goal.muscleMassKg} kg` : "Sin meta"}
          </span>
        </div>

        {/* Grasa Corporal */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">% Grasa</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {latestLog?.bodyFatPct ? `${latestLog.bodyFatPct}%` : "--"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 mt-2 block">
            {goal?.bodyFatPct ? `Meta: ${goal.bodyFatPct}%` : "Sin meta"}
          </span>
        </div>

        {/* Pasos */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Pasos (7d)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Footprints className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {stats?.averages?.dailySteps ? stats.averages.dailySteps.toLocaleString() : "--"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 mt-2 block">Promedio diario</span>
        </div>

        {/* Sueño */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Sueño (7d)</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {stats?.averages?.sleepHours ? `${stats.averages.sleepHours}` : "--"}
            </span>
            <span className="text-xs text-muted-foreground">hrs</span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 mt-2 block">Promedio diario</span>
        </div>

        {/* Agua */}
        <div className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Agua (7d)</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Droplets className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {stats?.averages?.waterLiters ? `${stats.averages.waterLiters}` : "--"}
            </span>
            <span className="text-xs text-muted-foreground">L</span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 mt-2 block">Promedio diario</span>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <currentMetricConfig.icon className="w-5 h-5" style={{ color: currentMetricConfig.color }} />
              Gráfica de Evolución: {currentMetricConfig.label}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Haz clic en las métricas para cambiar la variable visualizada.
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
              const cfg = METRIC_CONFIG[key];
              const isSelected = selectedMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-white/10 text-foreground border border-white/20 shadow-md"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  }`}
                  style={isSelected ? { borderColor: cfg.color, color: cfg.color } : {}}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-72 w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={currentMetricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetricConfig.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={currentMetricConfig.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff40" fontSize={11} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#ffffff20",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} ${currentMetricConfig.unit}`, currentMetricConfig.label]}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke={currentMetricConfig.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#${currentMetricConfig.gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border/40 rounded-2xl">
              <p className="text-sm text-muted-foreground">Aún no hay registros cargados. ¡Añade tu primer día!</p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Comparison & Detailed Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metas vs Progreso */}
        <div className="p-6 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Objetivos de Salud & Forma
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar metas
              </button>
            </div>

            <div className="space-y-4">
              {/* Peso target */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Peso Corporal</span>
                  <span className="text-foreground">
                    {latestLog?.weightKg ?? "--"} / {goal?.weightKg ? `${goal.weightKg} kg` : "Sin meta"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        latestLog?.weightKg && goal?.weightKg
                          ? Math.min(100, Math.round((latestLog.weightKg / goal.weightKg) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Masa Muscular target */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Masa Muscular</span>
                  <span className="text-emerald-400">
                    {latestLog?.muscleMassKg ?? "--"} / {goal?.muscleMassKg ? `${goal.muscleMassKg} kg` : "Sin meta"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        latestLog?.muscleMassKg && goal?.muscleMassKg
                          ? Math.min(100, Math.round((latestLog.muscleMassKg / goal.muscleMassKg) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Pasos Diarios */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Pasos Diarios</span>
                  <span className="text-teal-400">
                    {latestLog?.dailySteps ?? "--"} / {goal?.dailySteps ? `${goal.dailySteps} pasos` : "10,000"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        latestLog?.dailySteps && (goal?.dailySteps || 10000)
                          ? Math.min(100, Math.round((latestLog.dailySteps / (goal?.dailySteps || 10000)) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Agua */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Hidratación Diaria</span>
                  <span className="text-cyan-400">
                    {latestLog?.waterLiters ?? "--"} / {goal?.waterLiters ? `${goal.waterLiters} L` : "3 L"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        latestLog?.waterLiters && (goal?.waterLiters || 3)
                          ? Math.min(100, Math.round((latestLog.waterLiters / (goal?.waterLiters || 3)) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medidas Antropométricas & Constantes */}
        <div className="p-6 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-blue-400" /> Últimas Medidas & Constantes
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Pecho</span>
              <p className="text-lg font-extrabold text-foreground">{latestLog?.chestCm ? `${latestLog.chestCm} cm` : "--"}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Cintura</span>
              <p className="text-lg font-extrabold text-foreground">{latestLog?.waistCm ? `${latestLog.waistCm} cm` : "--"}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Cadera</span>
              <p className="text-lg font-extrabold text-foreground">{latestLog?.hipCm ? `${latestLog.hipCm} cm` : "--"}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Brazo</span>
              <p className="text-lg font-extrabold text-foreground">{latestLog?.armCm ? `${latestLog.armCm} cm` : "--"}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Frecuencia Reposo</span>
              <p className="text-lg font-extrabold text-rose-400">{latestLog?.restingHeartRate ? `${latestLog.restingHeartRate} bpm` : "--"}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground">Presión Arterial</span>
              <p className="text-lg font-extrabold text-indigo-400">
                {latestLog?.systolicBp && latestLog?.diastolicBp
                  ? `${latestLog.systolicBp}/${latestLog.diastolicBp}`
                  : "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs History Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" /> Historial de Registros
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
              <tr>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Peso</th>
                <th className="py-3 px-3">% Grasa</th>
                <th className="py-3 px-3">Masa Muscular</th>
                <th className="py-3 px-3">Cintura</th>
                <th className="py-3 px-3">Pasos</th>
                <th className="py-3 px-3">Sueño</th>
                <th className="py-3 px-3">Energía</th>
                <th className="py-3 px-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {logs.map((log) => {
                const dateStr = new Date(log.date).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-semibold">{dateStr}</td>
                    <td className="py-3 px-3">{log.weightKg ? `${log.weightKg} kg` : "--"}</td>
                    <td className="py-3 px-3">{log.bodyFatPct ? `${log.bodyFatPct}%` : "--"}</td>
                    <td className="py-3 px-3">{log.muscleMassKg ? `${log.muscleMassKg} kg` : "--"}</td>
                    <td className="py-3 px-3">{log.waistCm ? `${log.waistCm} cm` : "--"}</td>
                    <td className="py-3 px-3">{log.dailySteps ? log.dailySteps.toLocaleString() : "--"}</td>
                    <td className="py-3 px-3">{log.sleepHours ? `${log.sleepHours} hrs` : "--"}</td>
                    <td className="py-3 px-3">
                      {log.energyLevel ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400">
                          {log.energyLevel}/10
                        </span>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground truncate max-w-[150px]">
                      {log.notes || "--"}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted-foreground">
                    No hay registros de progreso guardados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-border/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Registrar Progreso Diario</h3>
                <p className="text-xs text-muted-foreground">Ingresa tus métricas corporales y hábitos de hoy.</p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-border/40 px-6 bg-slate-950/40">
              {[
                { id: "composition", label: "Composición", icon: Scale },
                { id: "measures", label: "Medidas (cm)", icon: Ruler },
                { id: "habits", label: "Hábitos", icon: Moon },
                { id: "vitals", label: "Vitales & Estado", icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
                      isActive
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveLog} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Date field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Fecha del registro</label>
                <input
                  type="date"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Tab 1: Composition */}
              {activeTab === "composition" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ej. 75.5"
                      value={logForm.weightKg}
                      onChange={(e) => setLogForm({ ...logForm, weightKg: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">% Grasa Corporal</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ej. 15.2"
                      value={logForm.bodyFatPct}
                      onChange={(e) => setLogForm({ ...logForm, bodyFatPct: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Masa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ej. 35.0"
                      value={logForm.muscleMassKg}
                      onChange={(e) => setLogForm({ ...logForm, muscleMassKg: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Measures */}
              {activeTab === "measures" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Pecho (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 100"
                      value={logForm.chestCm}
                      onChange={(e) => setLogForm({ ...logForm, chestCm: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Cintura (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 82"
                      value={logForm.waistCm}
                      onChange={(e) => setLogForm({ ...logForm, waistCm: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Cadera (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 96"
                      value={logForm.hipCm}
                      onChange={(e) => setLogForm({ ...logForm, hipCm: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Brazo (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 36"
                      value={logForm.armCm}
                      onChange={(e) => setLogForm({ ...logForm, armCm: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Muslo (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 55"
                      value={logForm.thighCm}
                      onChange={(e) => setLogForm({ ...logForm, thighCm: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Habits */}
              {activeTab === "habits" && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Horas de Sueño</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ej. 8.0"
                      value={logForm.sleepHours}
                      onChange={(e) => setLogForm({ ...logForm, sleepHours: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Agua (Litros)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ej. 2.5"
                      value={logForm.waterLiters}
                      onChange={(e) => setLogForm({ ...logForm, waterLiters: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Pasos Diarios</label>
                    <input
                      type="number"
                      placeholder="ej. 10000"
                      value={logForm.dailySteps}
                      onChange={(e) => setLogForm({ ...logForm, dailySteps: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Calorías Quemadas (kcal)</label>
                    <input
                      type="number"
                      placeholder="ej. 2400"
                      value={logForm.caloriesBurned}
                      onChange={(e) => setLogForm({ ...logForm, caloriesBurned: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Vitals & Status */}
              {activeTab === "vitals" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Frecuencia Reposo (bpm)</label>
                      <input
                        type="number"
                        placeholder="ej. 62"
                        value={logForm.restingHeartRate}
                        onChange={(e) => setLogForm({ ...logForm, restingHeartRate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Sistólica (mmHg)</label>
                      <input
                        type="number"
                        placeholder="ej. 120"
                        value={logForm.systolicBp}
                        onChange={(e) => setLogForm({ ...logForm, systolicBp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Diastólica (mmHg)</label>
                      <input
                        type="number"
                        placeholder="ej. 80"
                        value={logForm.diastolicBp}
                        onChange={(e) => setLogForm({ ...logForm, diastolicBp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Nivel de Energía: {logForm.energyLevel}/10</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={logForm.energyLevel}
                        onChange={(e) => setLogForm({ ...logForm, energyLevel: e.target.value })}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Nivel de Estrés: {logForm.stressLevel}/10</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={logForm.stressLevel}
                        onChange={(e) => setLogForm({ ...logForm, stressLevel: e.target.value })}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Notas del día</label>
                    <textarea
                      rows={2}
                      placeholder="Sensaciones del entrenamiento, dieta, suplementación..."
                      value={logForm.notes}
                      onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-border/80 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Definir Metas de Salud</h3>
                <p className="text-xs text-muted-foreground">Establece tus objetivos personales de estado físico.</p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta de Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="70.0"
                    value={goalForm.weightKg}
                    onChange={(e) => setGoalForm({ ...goalForm, weightKg: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta % Grasa</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.0"
                    value={goalForm.bodyFatPct}
                    onChange={(e) => setGoalForm({ ...goalForm, bodyFatPct: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Masa Muscular (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="38.0"
                    value={goalForm.muscleMassKg}
                    onChange={(e) => setGoalForm({ ...goalForm, muscleMassKg: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Pasos Diarios</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={goalForm.dailySteps}
                    onChange={(e) => setGoalForm({ ...goalForm, dailySteps: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Sueño (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="8.0"
                    value={goalForm.sleepHours}
                    onChange={(e) => setGoalForm({ ...goalForm, sleepHours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Meta Agua (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="3.0"
                    value={goalForm.waterLiters}
                    onChange={(e) => setGoalForm({ ...goalForm, waterLiters: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Metas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
