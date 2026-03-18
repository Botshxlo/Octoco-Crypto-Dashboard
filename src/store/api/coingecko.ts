import {
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import type { CoinMarket, CoinDetail, MarketChartData } from "@/types";

// Custom baseQuery with retry + backoff that respects 429s
const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: "https://api.coingecko.com/api/v3",
      prepareHeaders: (headers) => {
        const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
        if (apiKey) {
          headers.set("x-cg-demo-api-key", apiKey);
        }
        return headers;
      },
    })(args, api, extraOptions);

    // Don't retry on rate limit — bail immediately
    if (result.error && result.error.status === 429) {
      retry.fail(result.error);
    }

    return result;
  },
  { maxRetries: 1 }
);

export const coingeckoApi = createApi({
  reducerPath: "coingeckoApi",
  baseQuery: baseQueryWithRetry,
  // Cache results for 2 minutes to reduce API calls
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getMarkets: builder.query<
      CoinMarket[],
      { currency: string; page: number; perPage: number }
    >({
      query: ({ currency, page, perPage }) =>
        `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`,
    }),
    getCoinDetail: builder.query<CoinDetail, string>({
      query: (id) =>
        `/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    }),
    getMarketChart: builder.query<
      MarketChartData,
      { id: string; currency: string; days: string }
    >({
      query: ({ id, currency, days }) =>
        `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
    }),
  }),
});

export const {
  useGetMarketsQuery,
  useGetCoinDetailQuery,
  useGetMarketChartQuery,
} = coingeckoApi;
