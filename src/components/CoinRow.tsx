import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import type { CoinMarket } from "@/types";
import { formatCurrency, formatCompact, cn } from "@/lib/utils";

interface CoinRowProps {
  coin: CoinMarket;
  currency: string;
}

function PriceChange({ value }: { value: number | null }) {
  if (value == null) return <span className="text-sm text-muted-foreground">N/A</span>;
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium",
        isPositive
          ? "bg-positive/10 text-positive"
          : "bg-negative/10 text-negative"
      )}
    >
      {isPositive ? (
        <TrendingUp className="size-3.5" />
      ) : (
        <TrendingDown className="size-3.5" />
      )}
      {Math.abs(value).toFixed(2)}%
    </div>
  );
}

function MiniSparkline({ isPositive }: { isPositive: boolean }) {
  return (
    <div className="hidden w-20 items-center justify-end xl:flex">
      <svg
        width="60"
        height="24"
        viewBox="0 0 60 24"
        fill="none"
        className={isPositive ? "text-positive" : "text-negative"}
      >
        {isPositive ? (
          <path
            d="M1 20 L10 16 L20 18 L30 12 L40 14 L50 8 L59 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <path
            d="M1 4 L10 8 L20 6 L30 12 L40 10 L50 16 L59 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
}

export default function CoinRow({ coin, currency }: CoinRowProps) {
  const navigate = useNavigate();
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="group relative flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:bg-card-highlight cursor-pointer"
    >
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 glow-sm" />

      <div className="relative w-8 text-center text-sm font-medium text-muted-foreground">
        {coin.market_cap_rank}
      </div>

      <div className="relative flex flex-1 items-center gap-3">
        <div className="relative">
          <img
            src={coin.image}
            alt={coin.name}
            className="size-10 rounded-full ring-2 ring-white/5 transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {coin.name}
            </span>
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {coin.symbol}
          </span>
        </div>
      </div>

      <MiniSparkline isPositive={isPositive} />

      <div className="relative w-32 text-right">
        <span className="font-mono text-sm font-semibold text-foreground">
          {formatCurrency(coin.current_price, currency)}
        </span>
      </div>

      <div className="relative w-24 text-right">
        <PriceChange value={coin.price_change_percentage_24h} />
      </div>

      <div className="relative hidden w-36 text-right md:block">
        <span className="font-mono text-sm text-muted-foreground">
          {formatCurrency(coin.market_cap, currency)}
        </span>
      </div>

      <div className="relative hidden w-28 text-right lg:block">
        <span className="font-mono text-sm text-muted-foreground">
          {formatCompact(coin.total_volume)}
        </span>
      </div>

      <div className="relative w-6">
        <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
      </div>
    </div>
  );
}
