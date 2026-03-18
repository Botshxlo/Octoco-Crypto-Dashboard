import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "zar"
): string {
  const currencyMap: Record<string, string> = {
    zar: "ZAR",
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
  };

  if (currency === "btc") {
    return `₿${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })}`;
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyMap[currency] || "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
