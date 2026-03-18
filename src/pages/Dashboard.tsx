import { useState, useCallback, useEffect, useRef } from "react";
import {
  useGetMarketsQuery,
  useLazyGetMarketsQuery,
} from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CoinTable from "@/components/CoinTable";
import type { CoinMarket } from "@/types";

const PER_PAGE = 100;

export default function Dashboard() {
  const currency = useAppSelector((state) => state.currency.selected);
  const [extraCoins, setExtraCoins] = useState<CoinMarket[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const prevCurrency = useRef(currency);

  // Page 1: stable query with polling — never disrupted
  const { data: firstPage, isLoading, error } = useGetMarketsQuery(
    { currency, page: 1, perPage: PER_PAGE },
    { pollingInterval: 60000 }
  );

  // Lazy trigger for subsequent pages
  const [fetchMore] = useLazyGetMarketsQuery();

  // Reset when currency changes
  useEffect(() => {
    if (prevCurrency.current !== currency) {
      setExtraCoins([]);
      setPage(1);
      setHasMore(true);
      prevCurrency.current = currency;
    }
  }, [currency]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const result = await fetchMore({
        currency,
        page: nextPage,
        perPage: PER_PAGE,
      }).unwrap();

      if (result.length < PER_PAGE) {
        setHasMore(false);
      }

      setExtraCoins((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newCoins = result.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCoins];
      });

      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, currency, fetchMore]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  // Combine page 1 (always fresh from polling) + extra pages
  const allCoins = [...(firstPage ?? []), ...extraCoins];

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
        <div ref={sentinelRef} className="py-8 text-center">
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
