import { useState, useEffect, useRef } from "react";
import { useGetMarketsQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import CoinTable from "@/components/CoinTable";
import type { CoinMarket } from "@/types";

const PER_PAGE = 100;
const API_BASE = "https://api.coingecko.com/api/v3";

export default function Dashboard() {
  const currency = useAppSelector((state) => state.currency.selected);
  const [extraCoins, setExtraCoins] = useState<CoinMarket[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  // Page 1 only — stable RTK Query with polling
  const { data: firstPage, isLoading, error } = useGetMarketsQuery(
    { currency, page: 1, perPage: PER_PAGE },
    { pollingInterval: 60000 }
  );

  // Reset extra pages when currency changes
  useEffect(() => {
    setExtraCoins([]);
    pageRef.current = 1;
    setHasMore(true);
  }, [currency]);

  // Scroll-based infinite loading
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

  // Deduplicate: firstPage wins, extra coins fill in the rest
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Top Cryptocurrencies</h1>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-secondary rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error && allCoins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-negative">Failed to load market data.</p>
        <p className="text-muted-foreground text-sm mt-2">
          CoinGecko API may be rate-limited. Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Top Cryptocurrencies</h1>
        <span className="text-sm text-muted-foreground">
          {allCoins.length} coins
        </span>
      </div>
      <CoinTable coins={allCoins} currency={currency} />
      {hasMore && (
        <div className="py-8 text-center">
          {loadingMore && (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-secondary rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
