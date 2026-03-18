import { useNavigate } from "react-router-dom";
import type { CoinMarket } from "@/types";
import { formatCurrency, formatCompact, formatPercentage } from "@/lib/utils";

interface CoinRowProps {
  coin: CoinMarket;
  currency: string;
}

export default function CoinRow({ coin, currency }: CoinRowProps) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors"
    >
      <td className="py-4 px-3 text-muted-foreground text-sm">
        {coin.market_cap_rank}
      </td>
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"
          />
          <div>
            <span className="font-medium">{coin.name}</span>
            <span className="ml-2 text-xs text-muted-foreground uppercase">
              {coin.symbol}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-3 text-right font-mono text-sm">
        {formatCurrency(coin.current_price, currency)}
      </td>
      <td className="py-4 px-3 text-right text-sm">
        <span
          className={
            coin.price_change_percentage_24h >= 0
              ? "text-positive"
              : "text-negative"
          }
        >
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      </td>
      <td className="py-4 px-3 text-right font-mono text-sm hidden md:table-cell">
        {formatCurrency(coin.market_cap, currency)}
      </td>
      <td className="py-4 px-3 text-right font-mono text-sm hidden lg:table-cell">
        {formatCompact(coin.total_volume)}
      </td>
    </tr>
  );
}
