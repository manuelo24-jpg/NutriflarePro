"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Utensils,
  Plus,
  Trash2,
  Edit3,
  Flame,
  Sparkles,
  Search,
  CheckCircle2,
  PieChart,
  Apple,
  Coffee,
  Sun,
  Moon,
  X,
  PlusCircle,
  TrendingUp,
  Target
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

enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  SNACK = "SNACK",
  DINNER = "DINNER",
}

const DAYS_MAP: { key: DayOfWeek; label: string }[] = [
  { key: DayOfWeek.MONDAY, label: "Lunes" },
  { key: DayOfWeek.TUESDAY, label: "Martes" },
  { key: DayOfWeek.WEDNESDAY, label: "Miércoles" },
  { key: DayOfWeek.THURSDAY, label: "Jueves" },
  { key: DayOfWeek.FRIDAY, label: "Viernes" },
  { key: DayOfWeek.SATURDAY, label: "Sábado" },
  { key: DayOfWeek.SUNDAY, label: "Domingo" },
];

const MEAL_TYPE_CONFIG: Record<
  MealType,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  BREAKFAST: { label: "Desayuno", icon: Coffee, color: "#f59e0b", bgColor: "bg-amber-500/10 border-amber-500/20" },
  LUNCH: { label: "Almuerzo", icon: Sun, color: "#22c55e", bgColor: "bg-emerald-500/10 border-emerald-500/20" },
  SNACK: { label: "Merienda / Snack", icon: Apple, color: "#3b82f6", bgColor: "bg-blue-500/10 border-blue-500/20" },
  DINNER: { label: "Cena", icon: Moon, color: "#a855f7", bgColor: "bg-purple-500/10 border-purple-500/20" },
};

interface Dish {
  id: string;
  name: string;
  description: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: MealType;
}

interface MealPlanItem {
  id?: string;
  dishId: string;
  dish?: Dish;
  mealType: MealType;
  quantity: number;
}

interface MealPlan {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  isPublic: boolean;
  items: MealPlanItem[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function NutritionPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Builder form
  const [planForm, setPlanForm] = useState({
    name: "",
    dayOfWeek: DayOfWeek.MONDAY,
    isPublic: false,
    selectedItems: [] as MealPlanItem[],
  });

  const [dishSearch, setDishSearch] = useState("");
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User target macros (default recommendation)
  const targetMacros = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 65,
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [plansRes, dishesRes] = await Promise.all([
        api.get("/meal-plans"),
        api.get("/dishes"),
      ]);
      setMealPlans(plansRes.data);
      setAvailableDishes(dishesRes.data);
    } catch (err) {
      console.error("Error loading nutrition data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewMealPlanBuilder = () => {
    setEditingPlanId(null);
    setPlanForm({
      name: `Plan Nutricional ${DAYS_MAP.find((d) => d.key === selectedDay)?.label}`,
      dayOfWeek: selectedDay,
      isPublic: false,
      selectedItems: [],
    });
    setIsBuilderOpen(true);
  };

  const openEditMealPlanBuilder = (plan: MealPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      dayOfWeek: plan.dayOfWeek,
      isPublic: plan.isPublic,
      selectedItems: plan.items.map((item) => ({
        dishId: item.dishId,
        dish: item.dish,
        mealType: item.mealType,
        quantity: item.quantity,
      })),
    });
    setIsBuilderOpen(true);
  };

  const addDishToPlan = (dish: Dish, mealType: MealType) => {
    const existingIndex = planForm.selectedItems.findIndex(
      (item) => item.dishId === dish.id && item.mealType === mealType
    );

    if (existingIndex >= 0) {
      const updated = [...planForm.selectedItems];
      updated[existingIndex].quantity += 1;
      setPlanForm({ ...planForm, selectedItems: updated });
    } else {
      const newItem: MealPlanItem = {
        dishId: dish.id,
        dish,
        mealType,
        quantity: 1,
      };
      setPlanForm((prev) => ({
        ...prev,
        selectedItems: [...prev.selectedItems, newItem],
      }));
    }
  };

  const removeItemFromPlan = (index: number) => {
    setPlanForm((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((_, i) => i !== index),
    }));
  };

  const updateItemQuantity = (index: number, qty: number) => {
    if (qty <= 0) return;
    setPlanForm((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.map((item, i) =>
        i === index ? { ...item, quantity: qty } : item
      ),
    }));
  };

  const handleSaveMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) return;
    if (planForm.selectedItems.length === 0) {
      alert("Añade al menos un platillo al plan alimenticio.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: planForm.name,
        dayOfWeek: planForm.dayOfWeek,
        isPublic: planForm.isPublic,
        items: planForm.selectedItems.map((item) => ({
          dishId: item.dishId,
          mealType: item.mealType,
          quantity: item.quantity,
        })),
      };

      if (editingPlanId) {
        await api.put(`/meal-plans/${editingPlanId}`, payload);
      } else {
        await api.post("/meal-plans", payload);
      }

      setIsBuilderOpen(false);
      loadData();
    } catch (err) {
      console.error("Error saving meal plan:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este plan de alimentación?")) return;
    try {
      await api.delete(`/meal-plans/${id}`);
      loadData();
    } catch (err) {
      console.error("Error deleting meal plan:", err);
    }
  };

  // Active day plans & consolidated macros
  const activeDayPlans = mealPlans.filter((p) => p.dayOfWeek === selectedDay);
  const currentPlan = activeDayPlans[0] ?? null;

  const currentMacros = currentPlan?.totalMacros || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Calculate live macros in modal builder
  const liveModalMacros = planForm.selectedItems.reduce(
    (acc, item) => {
      const q = item.quantity || 1;
      const d = item.dish;
      if (d) {
        acc.calories += (d.calories || 0) * q;
        acc.protein += (d.protein || 0) * q;
        acc.carbs += (d.carbs || 0) * q;
        acc.fat += (d.fat || 0) * q;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const filteredDishesForModal = availableDishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(dishSearch.toLowerCase());
    const matchesMeal = selectedMealFilter === "ALL" || dish.mealType === selectedMealFilter;
    return matchesSearch && matchesMeal;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Nutrición & Macronutrientes
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Planes de Alimentación
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Planifica tus comidas diarias y calcula automáticamente tus calorías y macronutrientes.
          </p>
        </div>

        <button
          onClick={openNewMealPlanBuilder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Plan
        </button>
      </div>

      {/* Days Tabs Selector */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl no-scrollbar">
        {DAYS_MAP.map((day) => {
          const isActive = selectedDay === day.key;
          const hasPlan = mealPlans.some((p) => p.dayOfWeek === day.key);
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
              {hasPlan && (
                <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary-foreground" : "bg-emerald-400"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Real-time Daily Macro Dashboard Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/60 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" /> Resumen Nutricional del Día (
            {DAYS_MAP.find((d) => d.key === selectedDay)?.label})
          </h2>
          {currentPlan && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditMealPlanBuilder(currentPlan)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-border/60 text-xs font-semibold hover:bg-white/10 text-foreground flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-primary" /> Editar plan
              </button>
              <button
                onClick={() => handleDeletePlan(currentPlan.id)}
                className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calorías */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Calorías Totales</span>
              <span className="text-emerald-400">
                {currentMacros.calories} / {targetMacros.calories} kcal
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentMacros.calories / targetMacros.calories) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Proteínas */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Proteínas</span>
              <span className="text-blue-400">
                {currentMacros.protein}g / {targetMacros.protein}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentMacros.protein / targetMacros.protein) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Carbohidratos */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Carbohidratos</span>
              <span className="text-amber-400">
                {currentMacros.carbs}g / {targetMacros.carbs}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentMacros.carbs / targetMacros.carbs) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Grasas */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Grasas Saludables</span>
              <span className="text-purple-400">
                {currentMacros.fat}g / {targetMacros.fat}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentMacros.fat / targetMacros.fat) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals Layout by Category */}
      <div className="space-y-6">
        {currentPlan && currentPlan.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(MealType).map((mType) => {
              const cfg = MEAL_TYPE_CONFIG[mType];
              const Icon = cfg.icon;
              const itemsInMeal = currentPlan.items.filter((i) => i.mealType === mType);

              return (
                <div
                  key={mType}
                  className={`p-6 rounded-3xl border backdrop-blur-xl ${cfg.bgColor} space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                      </div>
                      {cfg.label}
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground">
                      {itemsInMeal.length} plato(s)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {itemsInMeal.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{item.dish?.name}</h4>
                          {item.dish?.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.dish.description}</p>
                          )}
                          <div className="flex gap-3 text-[11px] text-muted-foreground mt-2 font-medium">
                            <span className="text-emerald-400">{(item.dish?.calories || 0) * item.quantity} kcal</span>
                            <span>P: {(item.dish?.protein || 0) * item.quantity}g</span>
                            <span>C: {(item.dish?.carbs || 0) * item.quantity}g</span>
                            <span>G: {(item.dish?.fat || 0) * item.quantity}g</span>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-extrabold text-foreground">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}

                    {itemsInMeal.length === 0 && (
                      <p className="text-xs text-muted-foreground italic py-3">Sin alimentos asignados.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-card/80 border border-dashed border-border/60 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No hay plan de nutrición para este día</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Diseña tu menú saludable para el {DAYS_MAP.find((d) => d.key === selectedDay)?.label} seleccionando tus platos preferidos.
            </p>
            <button
              onClick={openNewMealPlanBuilder}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
            >
              Crear Plan de Comidas
            </button>
          </div>
        )}
      </div>

      {/* MealPlanBuilder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-border/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {editingPlanId ? "Editar Plan Nutricional" : "Crear Plan Nutricional"}
                </h3>
                <p className="text-xs text-muted-foreground">Selecciona los platillos y ajusta las porciones.</p>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Macro Summary Header inside Modal */}
            <div className="bg-slate-950 border-b border-border/40 px-6 py-3 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Calorías</span>
                <span className="font-bold text-emerald-400">{liveModalMacros.calories} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Proteínas</span>
                <span className="font-bold text-blue-400">{liveModalMacros.protein.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Carbohidratos</span>
                <span className="font-bold text-amber-400">{liveModalMacros.carbs.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Grasas</span>
                <span className="font-bold text-purple-400">{liveModalMacros.fat.toFixed(1)}g</span>
              </div>
            </div>

            <form onSubmit={handleSaveMealPlan} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Nombre del Plan</label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Día de la Semana</label>
                  <select
                    value={planForm.dayOfWeek}
                    onChange={(e) => setPlanForm({ ...planForm, dayOfWeek: e.target.value as DayOfWeek })}
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

              {/* Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left: Dish Catalog */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center justify-between">
                    <span>Catálogo de Platillos</span>
                  </h4>

                  {/* Search and filters */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Buscar plato..."
                        value={dishSearch}
                        onChange={(e) => setDishSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <select
                      value={selectedMealFilter}
                      onChange={(e) => setSelectedMealFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-border text-xs text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Todas las comidas</option>
                      {Object.entries(MEAL_TYPE_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {filteredDishesForModal.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2 hover:bg-white/10 transition-colors"
                      >
                        <div>
                          <span className="text-xs font-bold text-foreground block">{dish.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {dish.calories || 0} kcal | P: {dish.protein || 0}g C: {dish.carbs || 0}g G: {dish.fat || 0}g
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {(["BREAKFAST", "LUNCH", "SNACK", "DINNER"] as MealType[]).map((mType) => (
                            <button
                              key={mType}
                              type="button"
                              onClick={() => addDishToPlan(dish, mType)}
                              className="px-2 py-1 rounded bg-white/10 hover:bg-primary hover:text-primary-foreground text-[10px] font-bold text-foreground transition-colors"
                              title={`Añadir a ${MEAL_TYPE_CONFIG[mType].label}`}
                            >
                              +{mType[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Selected Dishes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground">
                    Menú del Plan ({planForm.selectedItems.length} ítems)
                  </h4>

                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                    {planForm.selectedItems.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-border/40 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {item.dish?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItemFromPlan(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-primary font-bold">
                            {MEAL_TYPE_CONFIG[item.mealType].label}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Porciones:</span>
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(idx, parseFloat(e.target.value) || 1)}
                              className="w-16 px-2 py-1 rounded bg-slate-950 border border-border text-xs text-foreground font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {planForm.selectedItems.length === 0 && (
                      <div className="h-40 border border-dashed border-border/40 rounded-xl flex items-center justify-center text-xs text-muted-foreground text-center p-4">
                        Haz clic en los botones +D, +A, +M, +C de los platos para agregarlos a tu plan.
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
                  {isSubmitting ? "Guardando..." : "Guardar Plan Nutricional"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
