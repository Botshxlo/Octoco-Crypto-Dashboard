import { useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useGetMarketChartQuery } from "@/store/api/coingecko";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ChartDays } from "@/types";

interface PriceChartProps {
  coinId: string;
  currency: string;
}

const granularityOptions: { value: ChartDays; label: string }[] = [
  { value: "1", label: "24h" },
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "365", label: "1y" },
];

type Dataset = "prices" | "market_caps" | "total_volumes";

const datasetOptions: { value: Dataset; label: string }[] = [
  { value: "prices", label: "Price" },
  { value: "market_caps", label: "Market Cap" },
  { value: "total_volumes", label: "Volume" },
];

export default function PriceChart({ coinId, currency }: PriceChartProps) {
  const [days, setDays] = useState<ChartDays>("7");
  const [dataset, setDataset] = useState<Dataset>("prices");

  const { data, isLoading } = useGetMarketChartQuery({
    id: coinId,
    currency,
    days,
  });

  const chartData =
    data?.[dataset]?.map(([timestamp, value]) => ({
      time: timestamp,
      value,
    })) ?? [];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (days === "1") return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (days === "7") return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Dataset Toggle */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {datasetOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDataset(opt.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                dataset === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Granularity Toggle */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {granularityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                days === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse bg-secondary rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                dataset === "prices"
                  ? formatCurrency(v, currency)
                  : Intl.NumberFormat("en", { notation: "compact" }).format(v)
              }
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(label: any) => formatTime(Number(label))}
              formatter={(value: any) => [
                dataset === "prices"
                  ? formatCurrency(value, currency)
                  : Intl.NumberFormat("en", { notation: "compact" }).format(value),
                dataset === "prices"
                  ? "Price"
                  : dataset === "market_caps"
                    ? "Market Cap"
                    : "Volume",
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#chartGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
