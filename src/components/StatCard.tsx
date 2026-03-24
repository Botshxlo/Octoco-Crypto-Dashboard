import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export default function StatCard({ label, value, icon, highlight }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300",
        "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        highlight && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {icon && (
            <div className="text-muted-foreground transition-colors group-hover:text-primary">
              {icon}
            </div>
          )}
        </div>
        <p className="mt-2 truncate font-mono text-lg font-bold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
