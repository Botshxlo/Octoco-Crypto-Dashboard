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

export default function CurrencySelector() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.currency.selected);

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {currencies.map((c) => (
        <button
          key={c.value}
          onClick={() => dispatch(setCurrency(c.value))}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            selected === c.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
