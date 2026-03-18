import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import { useGetMarketChartQuery } from "@/store/api/coingecko";
import { formatCurrency } from "@/lib/utils";
import type { ChartDays } from "@/types";

interface PriceChartProps {
  coinId: string;
  currency: string;
  days: ChartDays;
  dataset: "prices" | "market_caps" | "total_volumes";
}

export default function PriceChart({ coinId, currency, days, dataset }: PriceChartProps) {
  const { data, isLoading } = useGetMarketChartQuery({
    id: coinId,
    currency,
    days,
  });

  const chartData = useMemo(
    () =>
      data?.[dataset]?.map(([timestamp, value]) => ({
        date: timestamp,
        value,
      })) ?? [],
    [data, dataset]
  );

  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].value >= chartData[0].value;
  }, [chartData]);

  const gradientColor = isPositive ? "#10b981" : "#ef4444";
  const strokeColor = isPositive ? "#10b981" : "#ef4444";

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (days === "1")
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (days === "7") return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
    return value.toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="flex h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading chart data...</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} stopOpacity={0.25} />
            <stop offset="50%" stopColor={gradientColor} stopOpacity={0.1} />
            <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke="#52525b"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={60}
          dy={10}
        />
        <YAxis
          tickFormatter={formatYAxis}
          stroke="#52525b"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={65}
          domain={["auto", "auto"]}
          dx={-5}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length || !label) return null;
            return (
              <div className="rounded-xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                <p className="mb-1 text-xs text-muted-foreground">
                  {new Date(label as number).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="font-mono text-lg font-bold text-foreground">
                  {dataset === "prices"
                    ? formatCurrency(payload[0].value as number, currency)
                    : Intl.NumberFormat("en", { notation: "compact" }).format(
                        payload[0].value as number
                      )}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2.5}
          fill="url(#colorValue)"
          filter="url(#glow)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
