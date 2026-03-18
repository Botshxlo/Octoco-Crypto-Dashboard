import { Link, useLocation } from "react-router-dom";
import CurrencySelector from "./CurrencySelector";
import { cn } from "@/lib/utils";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/wallet", label: "My Wallet" },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            CryptoTracker
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <CurrencySelector />
      </div>
    </header>
  );
}
