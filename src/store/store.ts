import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authSlice } from "./userSlice";
import { cartSlice } from "./cartSlice";
import { categorySlice } from "./categorySlice";
import { matchSlice } from "./matchSlice";

import { createWrapper } from "next-redux-wrapper";
import logger from "redux-logger";

const middlewares = []

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}
 
const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [cartSlice.name]: cartSlice.reducer,
      [categorySlice.name]: categorySlice.reducer,
      [matchSlice.name]: matchSlice.reducer,
    },
    middleware: [logger],
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });