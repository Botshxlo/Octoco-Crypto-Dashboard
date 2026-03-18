import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useGetCoinDetailQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency, formatCompact, formatPercentage } from "@/lib/utils";
import PriceChart from "@/components/PriceChart";

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const currency = useAppSelector((state) => state.currency.selected);
  const { data: coin, isLoading, error } = useGetCoinDetailQuery(id!);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-secondary rounded" />
        <div className="h-64 bg-secondary rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-secondary rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="text-center py-12">
        <p className="text-negative">Failed to load coin details.</p>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const md = coin.market_data;
  const price = md.current_price[currency] ?? 0;
  const marketCap = md.market_cap[currency] ?? 0;
  const volume = md.total_volume[currency] ?? 0;
  const high24h = md.high_24h[currency] ?? 0;
  const low24h = md.low_24h[currency] ?? 0;
  const ath = md.ath[currency] ?? 0;
  const atl = md.atl[currency] ?? 0;

  const stats = [
    { label: "Market Cap", value: formatCurrency(marketCap, currency) },
    { label: "24h Volume", value: formatCurrency(volume, currency) },
    { label: "24h High", value: formatCurrency(high24h, currency) },
    { label: "24h Low", value: formatCurrency(low24h, currency) },
    { label: "Circulating Supply", value: formatCompact(md.circulating_supply) },
    { label: "Total Supply", value: md.total_supply ? formatCompact(md.total_supply) : "N/A" },
    { label: "Max Supply", value: md.max_supply ? formatCompact(md.max_supply) : "Unlimited" },
    { label: "Market Rank", value: `#${coin.market_cap_rank}` },
    { label: "All-Time High", value: formatCurrency(ath, currency) },
    { label: "All-Time Low", value: formatCurrency(atl, currency) },
  ];

  const changes = [
    { label: "24h", value: md.price_change_percentage_24h },
    { label: "7d", value: md.price_change_percentage_7d },
    { label: "30d", value: md.price_change_percentage_30d },
    { label: "1y", value: md.price_change_percentage_1y },
  ];

  const links = [
    ...coin.links.homepage.filter(Boolean).map((url) => ({ label: "Website", url })),
    ...coin.links.blockchain_site.filter(Boolean).slice(0, 2).map((url) => ({ label: "Explorer", url })),
    ...(coin.links.subreddit_url ? [{ label: "Reddit", url: coin.links.subreddit_url }] : []),
  ];

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={coin.image.large}
          alt={coin.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <span className="text-lg text-muted-foreground uppercase">
              {coin.symbol}
            </span>
            <span className="bg-secondary px-2 py-0.5 rounded text-xs">
              Rank #{coin.market_cap_rank}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-2xl font-mono font-bold">
              {formatCurrency(price, currency)}
            </span>
            <span
              className={`text-sm font-medium ${
                md.price_change_percentage_24h >= 0
                  ? "text-positive"
                  : "text-negative"
              }`}
            >
              {formatPercentage(md.price_change_percentage_24h)}
            </span>
          </div>
        </div>
      </div>

      {/* Price Changes */}
      <div className="flex gap-3 flex-wrap">
        {changes.map((c) => (
          <div key={c.label} className="bg-secondary rounded-lg px-4 py-2">
            <span className="text-xs text-muted-foreground">{c.label}</span>
            <p
              className={`text-sm font-medium ${
                c.value >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {c.value != null ? formatPercentage(c.value) : "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <PriceChart coinId={id!} currency={currency} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-medium mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {coin.description.en && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">About {coin.name}</h2>
          <p
            className="text-sm text-muted-foreground leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}

      {/* Links */}
      {links.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Links</h2>
          <div className="flex gap-2 flex-wrap">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/70 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
