import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrency } from "@/store/currencySlice";
import type { Currency } from "@/types";
import { cn } from "@/lib/utils";

const currencies: { value: Currency; label: string }[] = [
  { value: "zar", label: "ZAR" },
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "btc", label: "BTC" },
];

export default function CurrencySelector({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.currency.selected);

  return (
    <div className={cn("rounded-xl bg-secondary/80 p-1 flex", className)}>
      {currencies.map((c) => (
        <button
          key={c.value}
          onClick={() => dispatch(setCurrency(c.value))}
          className={cn(
            "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
            selected === c.value
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {selected === c.value && (
            <span className="absolute inset-0 rounded-lg bg-primary shadow-lg shadow-primary/25" />
          )}
          <span className="relative">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
