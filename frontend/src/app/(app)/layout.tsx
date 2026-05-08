"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  LineChart,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Rutinas", href: "/routines", icon: Dumbbell },
  { name: "Nutrición", href: "/nutrition", icon: Utensils },
  { name: "Progreso", href: "/progress", icon: LineChart },
  { name: "Comunidad", href: "/community", icon: Users },
  { name: "Perfil", href: "/profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me");
        useAuthStore.getState().setUser(res.data);
      } catch (err) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}
    logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xs">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Nutri<span className="text-primary">Flare</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:sticky top-0
          h-screen w-64
          bg-card/95 backdrop-blur-xl
          border-r border-border/60
          flex flex-col
          z-20
          transition-transform duration-300 ease-in-out
          md:flex
        `}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center gap-2.5 px-6 py-6 border-b border-border/40">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-[0_0_16px_rgba(34,197,94,0.3)]">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Nutri<span className="text-primary">Flare</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 mb-3">
            Menú principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  isActive
                    ? "bg-primary/12 text-primary border border-primary/20 shadow-[0_0_12px_rgba(34,197,94,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-primary" : ""
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-border/40 space-y-1">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-border/40 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/30 to-emerald-800/30 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-xs uppercase">
                  {user.username?.[0] ?? "U"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
