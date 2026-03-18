import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Wallet, Menu, X } from "lucide-react";
import CurrencySelector from "./CurrencySelector";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: TrendingUp },
  { to: "/wallet", label: "My Wallet", icon: Wallet },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass glass-border border-t-0 border-x-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
              <TrendingUp className="size-5 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-xl bg-white/10" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              CryptoTracker
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("size-4", isActive && "text-primary")} />
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-[17px] h-[2px] rounded-full bg-gradient-to-r from-primary to-purple-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <CurrencySelector className="hidden sm:flex" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass glass-border animate-in-up border-x-0 md:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <CurrencySelector className="flex" />
          </div>
        </div>
      )}
    </header>
  );
}
