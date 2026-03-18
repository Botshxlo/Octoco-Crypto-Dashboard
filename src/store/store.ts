import { configureStore } from "@reduxjs/toolkit";
import { coingeckoApi } from "./api/coingecko";
import currencyReducer from "./currencySlice";

export const store = configureStore({
  reducer: {
    [coingeckoApi.reducerPath]: coingeckoApi.reducer,
    currency: currencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coingeckoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
