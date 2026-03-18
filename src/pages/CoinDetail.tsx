import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Globe,
  MessageCircle,
  BarChart3,
  Activity,
  Coins,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetCoinDetailQuery } from "@/store/api/coingecko";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency, formatCompact, cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PriceChart from "@/components/PriceChart";
import StatCard from "@/components/StatCard";
import type { ChartDays } from "@/types";

type DataType = "prices" | "market_caps" | "total_volumes";

const TIME_RANGE_LABELS: Record<ChartDays, string> = {
  "1": "24h",
  "7": "7d",
  "30": "30d",
  "365": "1y",
};

function PriceChangeBadge({ label, value }: { label: string; value: number | undefined | null }) {
  if (value == null) return null;
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border px-5 py-3 transition-all duration-300",
        isPositive
          ? "border-positive/30 bg-positive/5 hover:border-positive/50 hover:bg-positive/10"
          : "border-negative/30 bg-negative/5 hover:border-negative/50 hover:bg-negative/10"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="size-4 text-positive" />
        ) : (
          <TrendingDown className="size-4 text-negative" />
        )}
        <p className={cn("text-lg font-bold", isPositive ? "text-positive" : "text-negative")}>
          {isPositive ? "+" : ""}
          {value.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

function CoinDetailSkeleton() {
  return (
    <div>
      <Skeleton className="mb-8 h-5 w-40 rounded-full" />
      <div className="mb-10 flex items-center gap-5">
        <Skeleton className="size-20 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>
      </div>
      <div className="mb-10 flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mb-10 h-[400px] w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function getLinkIcon(url: string) {
  if (url.includes("github")) return Activity;
  if (url.includes("reddit")) return MessageCircle;
  return Globe;
}

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const currency = useAppSelector((state) => state.currency.selected);
  const { data: coin, isLoading, error } = useGetCoinDetailQuery(id!);

  const [timeRange, setTimeRange] = useState<ChartDays>("7");
  const [dataType, setDataType] = useState<DataType>("prices");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  if (isLoading) return <CoinDetailSkeleton />;

  if (error || !coin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <TrendingDown className="size-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Unable to Load Coin Data</h2>
        <p className="mb-6 text-muted-foreground">
          Failed to load data for this cryptocurrency. Please try again later.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const md = coin.market_data;
  const price = md.current_price[currency] ?? 0;
  const priceChange24h = md.price_change_percentage_24h;

  const formatSupply = (value: number | null) => {
    if (!value) return "N/A";
    return formatCompact(value);
  };

  const externalLinks = [
    ...coin.links.homepage.filter(Boolean).map((url) => ({ label: "Website", url })),
    ...coin.links.blockchain_site.filter(Boolean).slice(0, 2).map((url) => ({ label: "Explorer", url })),
    ...(coin.links.subreddit_url ? [{ label: "Reddit", url: coin.links.subreddit_url }] : []),
  ];

  return (
    <div>
      {/* Back Navigation */}
      <Link
        to="/"
        className="group mb-8 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-xl" />
          <img
            src={coin.image.large}
            alt={coin.name}
            className="relative size-20 rounded-2xl shadow-2xl ring-2 ring-white/10"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {coin.name}
            </h1>
            <span className="text-xl font-medium uppercase text-muted-foreground">
              {coin.symbol}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <Award className="size-3.5" />
              Rank #{coin.market_cap_rank}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
              {formatCurrency(price, currency)}
            </span>
            {priceChange24h != null && (
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-lg font-bold",
                  priceChange24h >= 0
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative"
                )}
              >
                {priceChange24h >= 0 ? (
                  <TrendingUp className="size-5" />
                ) : (
                  <TrendingDown className="size-5" />
                )}
                {priceChange24h >= 0 ? "+" : ""}
                {priceChange24h.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Change Badges */}
      <div className="mb-10 flex flex-wrap gap-3">
        <PriceChangeBadge label="24h" value={md.price_change_percentage_24h} />
        <PriceChangeBadge label="7d" value={md.price_change_percentage_7d} />
        <PriceChangeBadge label="30d" value={md.price_change_percentage_30d} />
        <PriceChangeBadge label="1y" value={md.price_change_percentage_1y} />
      </div>

      {/* Chart */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/5">
        <div className="flex flex-col justify-between gap-4 border-b border-border/50 p-5 sm:flex-row sm:items-center">
          <Tabs value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger
                value="prices"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Activity className="size-3.5" />
                Price
              </TabsTrigger>
              <TabsTrigger
                value="market_caps"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="size-3.5" />
                Market Cap
              </TabsTrigger>
              <TabsTrigger
                value="total_volumes"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Coins className="size-3.5" />
                Volume
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as ChartDays)}>
            <TabsList className="bg-secondary/50">
              {(Object.entries(TIME_RANGE_LABELS) as [ChartDays, string][]).map(
                ([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {label}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </Tabs>
        </div>
        <div className="p-4">
          <PriceChart coinId={id!} currency={currency} days={timeRange} dataset={dataType} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        <StatCard
          label="Market Cap"
          value={formatCurrency(md.market_cap[currency] ?? 0, currency)}
          icon={<BarChart3 className="size-4" />}
        />
        <StatCard
          label="24h Volume"
          value={formatCurrency(md.total_volume[currency] ?? 0, currency)}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          label="24h High"
          value={formatCurrency(md.high_24h[currency] ?? 0, currency)}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="24h Low"
          value={formatCurrency(md.low_24h[currency] ?? 0, currency)}
          icon={<TrendingDown className="size-4" />}
        />
        <StatCard
          label="Circulating"
          value={formatSupply(md.circulating_supply)}
          icon={<Coins className="size-4" />}
        />
        <StatCard label="Total Supply" value={formatSupply(md.total_supply)} />
        <StatCard
          label="Max Supply"
          value={md.max_supply ? formatCompact(md.max_supply) : "Unlimited"}
        />
        <StatCard
          label="Market Rank"
          value={`#${coin.market_cap_rank}`}
          icon={<Award className="size-4" />}
          highlight
        />
        <StatCard
          label="All-Time High"
          value={formatCurrency(md.ath[currency] ?? 0, currency)}
        />
        <StatCard
          label="All-Time Low"
          value={formatCurrency(md.atl[currency] ?? 0, currency)}
        />
      </div>

      {/* About Section */}
      {coin.description.en && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="border-b border-border/50 px-6 py-4">
            <h2 className="text-xl font-bold text-foreground">About {coin.name}</h2>
          </div>
          <div className="p-6">
            <div
              className={cn(
                "prose prose-invert prose-sm max-w-none text-muted-foreground",
                !descriptionExpanded && "line-clamp-4"
              )}
              dangerouslySetInnerHTML={{ __html: coin.description.en }}
            />
            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {descriptionExpanded ? (
                <>
                  Show less
                  <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* External Links */}
      {externalLinks.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Resources</h2>
          <div className="flex flex-wrap gap-3">
            {externalLinks.map((link, i) => {
              const Icon = getLinkIcon(link.url);
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-border/50 bg-card px-5 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                >
                  <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  {link.label}
                  <ExternalLink className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
