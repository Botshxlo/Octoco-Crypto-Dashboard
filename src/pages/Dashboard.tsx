import { useState, useCallback, useEffect, useRef } from "react";
import { useGetMarketsQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CoinTable from "@/components/CoinTable";
import type { CoinMarket } from "@/types";

const PER_PAGE = 100;

export default function Dashboard() {
  const currency = useAppSelector((state) => state.currency.selected);
  const [page, setPage] = useState(1);
  const [allCoins, setAllCoins] = useState<CoinMarket[]>([]);
  const prevCurrency = useRef(currency);

  const { data, isLoading, isFetching, error } = useGetMarketsQuery(
    { currency, page, perPage: PER_PAGE },
    { pollingInterval: 60000 }
  );

  useEffect(() => {
    if (prevCurrency.current !== currency) {
      setAllCoins([]);
      setPage(1);
      prevCurrency.current = currency;
    }
  }, [currency]);

  useEffect(() => {
    if (data) {
      setAllCoins((prev) => {
        if (page === 1) return data;
        const existingIds = new Set(prev.map((c) => c.id));
        const newCoins = data.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCoins];
      });
    }
  }, [data, page]);

  const hasMore = data?.length === PER_PAGE;

  const loadMore = useCallback(() => {
    if (!isFetching) {
      setPage((p) => p + 1);
    }
  }, [isFetching]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  if (isLoading && allCoins.length === 0) {
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
          {isFetching && (
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
