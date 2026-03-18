import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CoinMarket, CoinDetail, MarketChartData } from "@/types";

export const coingeckoApi = createApi({
  reducerPath: "coingeckoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3",
  }),
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
