import type { CoinMarket } from "@/types";
import CoinRow from "./CoinRow";

interface CoinTableProps {
  coins: CoinMarket[];
  currency: string;
}

export default function CoinTable({ coins, currency }: CoinTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-4 border-b border-border/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="w-8 text-center">#</div>
        <div className="flex-1">Coin</div>
        <div className="w-32 text-right">Price</div>
        <div className="w-24 text-right">24h</div>
        <div className="hidden w-36 text-right md:block">Market Cap</div>
        <div className="hidden w-28 text-right lg:block">Volume</div>
        <div className="w-6" />
      </div>
      <div className="divide-y divide-border/30">
        {coins.map((coin) => (
          <CoinRow key={coin.id} coin={coin} currency={currency} />
        ))}
      </div>
    </div>
  );
}
