"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Dumbbell,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Sparkles,
  Flame,
  Search,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  ShieldAlert,
  Share2
} from "lucide-react";

enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

const DAYS_MAP: { key: DayOfWeek; label: string; short: string }[] = [
  { key: DayOfWeek.MONDAY, label: "Lunes", short: "LUN" },
  { key: DayOfWeek.TUESDAY, label: "Martes", short: "MAR" },
  { key: DayOfWeek.WEDNESDAY, label: "Miércoles", short: "MIÉ" },
  { key: DayOfWeek.THURSDAY, label: "Jueves", short: "JUE" },
  { key: DayOfWeek.FRIDAY, label: "Viernes", short: "VIE" },
  { key: DayOfWeek.SATURDAY, label: "Sábado", short: "SÁB" },
  { key: DayOfWeek.SUNDAY, label: "Domingo", short: "DOM" },
];

const MUSCLE_TRANSLATIONS: Record<string, string> = {
  CHEST: "Pecho",
  BACK: "Espalda",
  LEGS: "Piernas",
  SHOULDERS: "Hombros",
  ARMS: "Brazos",
  CORE: "Abdomen / Core",
  GLUTES: "Glúteos",
  FULL_BODY: "Cuerpo Completo",
  CARDIO: "Cardio",
};

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: number;
  description: string | null;
}

interface RoutineExerciseItem {
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
  order: number;
}

interface Routine {
  id: string;
  name: string;
  description: string | null;
  dayOfWeek: DayOfWeek;
  isPublic: boolean;
  exercises: RoutineExerciseItem[];
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [printRoutine, setPrintRoutine] = useState<Routine | null>(null);

  // Builder form state
  const [routineForm, setRoutineForm] = useState({
    name: "",
    description: "",
    dayOfWeek: DayOfWeek.MONDAY,
    isPublic: false,
    selectedItems: [] as RoutineExerciseItem[],
  });

  // Exercise search state in builder
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [routinesRes, exercisesRes] = await Promise.all([
        api.get("/routines"),
        api.get("/exercises"),
      ]);
      setRoutines(routinesRes.data);
      setAvailableExercises(exercisesRes.data);
    } catch (err) {
      console.error("Error loading routines:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewRoutineBuilder = (day?: DayOfWeek) => {
    setEditingRoutineId(null);
    setRoutineForm({
      name: "",
      description: "",
      dayOfWeek: day || selectedDay,
      isPublic: false,
      selectedItems: [],
    });
    setIsBuilderOpen(true);
  };

  const openEditRoutineBuilder = (r: Routine) => {
    setEditingRoutineId(r.id);
    setRoutineForm({
      name: r.name,
      description: r.description || "",
      dayOfWeek: r.dayOfWeek,
      isPublic: r.isPublic,
      selectedItems: r.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exercise: ex.exercise,
        sets: ex.sets,
        reps: ex.reps,
        restSeconds: ex.restSeconds || 60,
        order: ex.order,
      })),
    });
    setIsBuilderOpen(true);
  };

  const addExerciseToRoutine = (ex: Exercise) => {
    if (routineForm.selectedItems.some((item) => item.exerciseId === ex.id)) return;
    const newItem: RoutineExerciseItem = {
      exerciseId: ex.id,
      exercise: ex,
      sets: 4,
      reps: 10,
      restSeconds: 60,
      order: routineForm.selectedItems.length + 1,
    };
    setRoutineForm((prev) => ({
      ...prev,
      selectedItems: [...prev.selectedItems, newItem],
    }));
  };

  const removeExerciseFromRoutine = (exerciseId: string) => {
    setRoutineForm((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems
        .filter((item) => item.exerciseId !== exerciseId)
        .map((item, idx) => ({ ...item, order: idx + 1 })),
    }));
  };

  const updateExerciseParam = (exerciseId: string, field: "sets" | "reps" | "restSeconds", val: number) => {
    setRoutineForm((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.map((item) =>
        item.exerciseId === exerciseId ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineForm.name.trim()) return;
    if (routineForm.selectedItems.length === 0) {
      alert("Añade al menos un ejercicio a la rutina.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: routineForm.name,
        description: routineForm.description,
        dayOfWeek: routineForm.dayOfWeek,
        isPublic: routineForm.isPublic,
        exercises: routineForm.selectedItems.map((item, index) => ({
          exerciseId: item.exerciseId,
          sets: Number(item.sets),
          reps: Number(item.reps),
          restSeconds: Number(item.restSeconds),
          order: index + 1,
        })),
      };

      if (editingRoutineId) {
        await api.put(`/routines/${editingRoutineId}`, payload);
      } else {
        await api.post("/routines", payload);
      }

      setIsBuilderOpen(false);
      loadData();
    } catch (err) {
      console.error("Error saving routine:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta rutina?")) return;
    try {
      await api.delete(`/routines/${id}`);
      loadData();
    } catch (err) {
      console.error("Error deleting routine:", err);
    }
  };

  // Filter routines by active day
  const filteredRoutines = routines.filter((r) => r.dayOfWeek === selectedDay);

  // Filter exercises in modal
  const filteredExercisesForModal = availableExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === "ALL" || ex.muscleGroup === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Entrenamiento Personalizado
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Gestor de Rutinas
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Diseña, organiza y exporta tus sesiones de entrenamiento por día de la semana.
          </p>
        </div>

        <button
          onClick={() => openNewRoutineBuilder()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Rutina
        </button>
      </div>

      {/* Days Tabs Selector */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl no-scrollbar">
        {DAYS_MAP.map((day) => {
          const isActive = selectedDay === day.key;
          const count = routines.filter((r) => r.dayOfWeek === day.key).length;
          return (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all flex-shrink-0 min-w-[120px] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <span>{day.label}</span>
              {count > 0 && (
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Cards Section */}
      <div className="space-y-6">
        {filteredRoutines.length > 0 ? (
          filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl relative overflow-hidden group hover:border-primary/40 transition-all"
            >
              {/* Top info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-foreground">{routine.name}</h2>
                    {routine.isPublic && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                        Pública
                      </span>
                    )}
                  </div>
                  {routine.description && (
                    <p className="text-sm text-muted-foreground mt-1">{routine.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintRoutine(routine)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border/60 text-xs font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    Ficha para Gym
                  </button>
                  <button
                    onClick={() => openEditRoutineBuilder(routine)}
                    className="p-2 rounded-xl bg-white/5 border border-border/60 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                    title="Editar rutina"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoutine(routine.id)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-red-400"
                    title="Eliminar rutina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exercises List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routine.exercises.map((item, index) => (
                  <div
                    key={item.exerciseId + index}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-border/40 hover:bg-white/[0.06] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-muted-foreground">
                          {MUSCLE_TRANSLATIONS[item.exercise?.muscleGroup || "FULL_BODY"]}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground mb-1">
                        {item.exercise?.name || "Ejercicio"}
                      </h4>
                      {item.exercise?.description && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-3">
                          {item.exercise.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-foreground font-semibold">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Flame className="w-3.5 h-3.5" />
                        {item.sets} series x {item.reps} reps
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {item.restSeconds}s descanso
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-card/80 border border-dashed border-border/60 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Dumbbell className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No hay rutinas para este día</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Crea tu plan de entrenamiento para el {DAYS_MAP.find((d) => d.key === selectedDay)?.label} agregando ejercicios, series y descansos.
            </p>
            <button
              onClick={() => openNewRoutineBuilder()}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
            >
              Crear Rutina
            </button>
          </div>
        )}
      </div>

      {/* RoutineBuilder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-border/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {editingRoutineId ? "Editar Rutina" : "Crear Nueva Rutina"}
                </h3>
                <p className="text-xs text-muted-foreground">Selecciona ejercicios y define series y descansos.</p>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Nombre de la Rutina</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Torso e Hipertrofia Pecho/Espalda"
                    value={routineForm.name}
                    onChange={(e) => setRoutineForm({ ...routineForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Día de la Semana</label>
                  <select
                    value={routineForm.dayOfWeek}
                    onChange={(e) => setRoutineForm({ ...routineForm, dayOfWeek: e.target.value as DayOfWeek })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-border text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {DAYS_MAP.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exercises Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left: Exercises Catalog */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center justify-between">
                    <span>Catálogo de Ejercicios</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {filteredExercisesForModal.length} disponibles
                    </span>
                  </h4>

                  {/* Search and filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <select
                      value={selectedMuscleFilter}
                      onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-border text-xs text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Todos los músculos</option>
                      {Object.entries(MUSCLE_TRANSLATIONS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* List of exercises */}
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {filteredExercisesForModal.map((ex) => {
                      const isAdded = routineForm.selectedItems.some((item) => item.exerciseId === ex.id);
                      return (
                        <div
                          key={ex.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => !isAdded && addExerciseToRoutine(ex)}
                        >
                          <div>
                            <span className="text-xs font-bold text-foreground block">{ex.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {MUSCLE_TRANSLATIONS[ex.muscleGroup]} • Dif. {ex.difficulty}/5
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={isAdded}
                            className={`p-1.5 rounded-lg text-xs font-bold ${
                              isAdded
                                ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Exercises Config */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center justify-between">
                    <span>Ejercicios Seleccionados ({routineForm.selectedItems.length})</span>
                  </h4>

                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                    {routineForm.selectedItems.map((item, idx) => (
                      <div
                        key={item.exerciseId}
                        className="p-3 rounded-xl bg-white/5 border border-border/40 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">
                            #{idx + 1} {item.exercise?.name || "Ejercicio"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeExerciseFromRoutine(item.exerciseId)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground block">Series</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={item.sets}
                              onChange={(e) => updateExerciseParam(item.exerciseId, "sets", parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-border text-xs text-foreground font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-muted-foreground block">Reps</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={item.reps}
                              onChange={(e) => updateExerciseParam(item.exerciseId, "reps", parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-border text-xs text-foreground font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-muted-foreground block">Descanso (s)</label>
                            <input
                              type="number"
                              min="0"
                              step="15"
                              value={item.restSeconds}
                              onChange={(e) => updateExerciseParam(item.exerciseId, "restSeconds", parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-border text-xs text-foreground font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {routineForm.selectedItems.length === 0 && (
                      <div className="h-40 border border-dashed border-border/40 rounded-xl flex items-center justify-center text-xs text-muted-foreground text-center p-4">
                        Haz clic en los ejercicios del catálogo para añadirlos a tu rutina.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit footer */}
              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Rutina"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gym Print / PDF Sheet Modal */}
      {printRoutine && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl print:p-0 print:shadow-none">
            <button
              onClick={() => setPrintRoutine(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">NutriFlare — Ficha de Gimnasio</h2>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                  Día: {DAYS_MAP.find((d) => d.key === printRoutine.dayOfWeek)?.label}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-600">{printRoutine.name}</span>
              </div>
            </div>

            {printRoutine.description && (
              <p className="text-sm text-slate-600 mb-6 italic">{printRoutine.description}</p>
            )}

            <table className="w-full text-left text-sm border-collapse mb-8">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-bold uppercase text-slate-700 bg-slate-100">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Ejercicio</th>
                  <th className="py-2 px-3">Grupo Muscular</th>
                  <th className="py-2 px-3 text-center">Series x Reps</th>
                  <th className="py-2 px-3 text-center">Descanso</th>
                  <th className="py-2 px-3 text-center print:table-cell">Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {printRoutine.exercises.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.exercise?.name}</td>
                    <td className="py-3 px-3 text-xs text-slate-600">
                      {MUSCLE_TRANSLATIONS[item.exercise?.muscleGroup || "FULL_BODY"]}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">
                      {item.sets} x {item.reps}
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-slate-600">{item.restSeconds}s</td>
                    <td className="py-3 px-3 text-center">
                      <div className="w-5 h-5 border-2 border-slate-400 rounded mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs text-slate-500 print:hidden">
              <span>© NutriFlare Pro — Tu progreso en el entrenamiento</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir Ficha PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
