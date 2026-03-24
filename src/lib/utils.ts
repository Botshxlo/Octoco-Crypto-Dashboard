import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | null,
  currency: string = "zar"
): string {
  if (value == null) return "N/A";
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

export function formatCompact(value: number | null): string {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function formatCurrencyCompact(
  value: number | null,
  currency: string = "zar"
): string {
  if (value == null) return "N/A";
  const symbol =
    currency === "btc" ? "₿" : currency === "eur" ? "€" : currency === "usd" ? "$" : "R";
  if (Math.abs(value) >= 1e12) return `${symbol}${(value / 1e12).toFixed(2)}T`;
  if (Math.abs(value) >= 1e9) return `${symbol}${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `${symbol}${(value / 1e6).toFixed(2)}M`;
  return formatCurrency(value, currency);
}

export function formatPercentage(value: number | null): string {
  if (value == null) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
