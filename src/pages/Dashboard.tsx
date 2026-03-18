import { useGetMarketsQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import CoinTable from "@/components/CoinTable";

export default function Dashboard() {
  const currency = useAppSelector((state) => state.currency.selected);
  const { data: coins, isLoading, error } = useGetMarketsQuery(
    { currency, page: 1, perPage: 100 },
    { pollingInterval: 60000 }
  );

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

  if (error) {
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
      <h1 className="text-2xl font-bold mb-6">Top Cryptocurrencies</h1>
      {coins && <CoinTable coins={coins} currency={currency} />}
    </div>
  );
}
