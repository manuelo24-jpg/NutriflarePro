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
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Routines", href: "/routines", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Utensils },
  { name: "Progress", href: "/progress", icon: LineChart },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
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
        // If getting profile fails (e.g. no token, invalid token), redirect to login
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
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-primary">NutriFlare</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? "block" : "hidden"} 
        md:block w-full md:w-64 bg-card border-r border-border p-4 flex flex-col fixed md:sticky top-0 h-screen z-10
      `}>
        <div className="hidden md:block mb-8 mt-4 px-4">
          <h1 className="text-2xl font-bold text-primary tracking-tight">NutriFlare</h1>
        </div>

        <nav className="flex-1 space-y-2 mt-4 md:mt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border mt-auto mb-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
