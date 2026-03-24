import { useState, useEffect, useRef } from "react";
import { TrendingUp, BarChart3, Activity, Loader2 } from "lucide-react";
import { useGetMarketsQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/lib/utils";
import CoinTable from "@/components/CoinTable";
import CoinTableSkeleton from "@/components/CoinTableSkeleton";
import CurrencySelector from "@/components/CurrencySelector";
import type { CoinMarket } from "@/types";

const PER_PAGE = 100;
const API_BASE = "https://api.coingecko.com/api/v3";

function MarketStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-3 inline-flex rounded-xl bg-secondary p-2.5">
          <Icon className="size-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatLargeNumber(num: number, currency: string) {
  const symbol = currency === "btc" ? "₿" : currency === "eur" ? "€" : currency === "usd" ? "$" : "R";
  if (num >= 1e12) return `${symbol}${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${symbol}${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`;
  return formatCurrency(num, currency);
}

export default function Dashboard() {
  const currency = useAppSelector((state) => state.currency.selected);
  const [extraCoins, setExtraCoins] = useState<CoinMarket[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  const { data: firstPage, isLoading, error } = useGetMarketsQuery(
    { currency, page: 1, perPage: PER_PAGE },
    { pollingInterval: 60000 }
  );

  useEffect(() => {
    setExtraCoins([]);
    pageRef.current = 1;
    setHasMore(true);
  }, [currency]);

  useEffect(() => {
    if (!hasMore) return;

    const handleScroll = () => {
      if (loadingMore) return;
      const scrollBottom =
        window.innerHeight + document.documentElement.scrollTop;
      const docHeight = document.documentElement.offsetHeight;

      if (docHeight - scrollBottom < 300) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  async function fetchNextPage() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

      const res = await fetch(
        `${API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${PER_PAGE}&page=${nextPage}&sparkline=false`,
        { headers }
      );

      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const data: CoinMarket[] = await res.json();

      if (data.length < PER_PAGE) {
        setHasMore(false);
      }

      setExtraCoins((prev) => [...prev, ...data]);
      pageRef.current = nextPage;
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  const allCoins = (() => {
    const first = firstPage ?? [];
    const seen = new Set(first.map((c) => c.id));
    const deduped = extraCoins.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    return [...first, ...deduped];
  })();

  const totalMarketCap = allCoins.reduce((acc, c) => acc + (c.market_cap || 0), 0);
  const totalVolume = allCoins.reduce((acc, c) => acc + (c.total_volume || 0), 0);
  const avgChange =
    allCoins.length > 0
      ? allCoins.reduce((acc, c) => acc + (c.price_change_percentage_24h || 0), 0) / allCoins.length
      : 0;

  if (error && allCoins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Unable to Load Data</h2>
        <p className="text-muted-foreground">
          Failed to load cryptocurrency data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Top Cryptocurrencies
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track the latest prices and market trends in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            {allCoins.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <div className="size-2 animate-pulse rounded-full bg-positive" />
                <span className="text-sm font-medium text-muted-foreground">
                  {allCoins.length} coins loaded
                </span>
              </div>
            )}
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      {!isLoading && allCoins.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MarketStatCard
            icon={TrendingUp}
            label="Total Market Cap"
            value={formatLargeNumber(totalMarketCap, currency)}
          />
          <MarketStatCard
            icon={BarChart3}
            label="24h Trading Volume"
            value={formatLargeNumber(totalVolume, currency)}
          />
          <MarketStatCard
            icon={Activity}
            label="Avg. 24h Change"
            value={`${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`}
          />
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/5">
        {isLoading ? (
          <CoinTableSkeleton rows={10} />
        ) : (
          <CoinTable coins={allCoins} currency={currency} />
        )}
      </div>

      {/* Load More Indicator */}
      <div className="flex justify-center py-10">
        {loadingMore && (
          <div className="flex items-center gap-3 rounded-full bg-secondary px-5 py-2.5">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Loading more coins...</span>
          </div>
        )}
        {!hasMore && allCoins.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm">End of list</span>
            <div className="h-px w-12 bg-border" />
          </div>
        )}
      </div>
    </div>
  );
}
