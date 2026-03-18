import type { CoinMarket } from "@/types";
import CoinRow from "./CoinRow";

interface CoinTableProps {
  coins: CoinMarket[];
  currency: string;
}

export default function CoinTable({ coins, currency }: CoinTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
            <th className="py-3 px-3 text-left font-medium">#</th>
            <th className="py-3 px-3 text-left font-medium">Coin</th>
            <th className="py-3 px-3 text-right font-medium">Price</th>
            <th className="py-3 px-3 text-right font-medium">24h %</th>
            <th className="py-3 px-3 text-right font-medium hidden md:table-cell">
              Market Cap
            </th>
            <th className="py-3 px-3 text-right font-medium hidden lg:table-cell">
              Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} currency={currency} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
