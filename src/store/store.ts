import { configureStore, ThunkAction, Action, isAllOf } from "@reduxjs/toolkit";
import { authSlice } from "./userSlice";
import { cartSlice } from "./cartSlice";
import { categorySlice } from "./categorySlice";
import { matchSlice } from "./matchSlice";

import * as LZString from "lz-string"

import { createWrapper } from "next-redux-wrapper";
import logger from "redux-logger";
import { setCookie } from "nookies";

const middlewares = []

const nextPersist = store => next => action => {
  const result = next(action)

  if (action.type !== `__NEXT_REDUX_WRAPPER_HYDRATE__`) {
    const storeString = JSON.stringify(store.getState())
    let lgt = storeString.length / 2000
    if(lgt < 1) lgt = 1 
    console.log(`entrando no calculo`, lgt)

    for(let i = 0; i < lgt; i++){
      let newStr = ""
      if(i === 0){
        newStr = storeString.slice(0, 2000)
      } else {
        newStr = storeString.slice(2000 * i, (2000 * i )+ 2000)
      }
      console.log(newStr)
      setCookie(undefined, `${i}_shop_store`, newStr, {
        maxAge: 60 * 60 * 7,
        path: '/',
      })
    }

  }
  return result
}


if (process.env.NODE_ENV === "development") {
  middlewares.push(nextPersist)
  middlewares.push(logger)
}

const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [cartSlice.name]: cartSlice.reducer,
      [categorySlice.name]: categorySlice.reducer,
      [matchSlice.name]: matchSlice.reducer,
    },
    middleware: [...middlewares],
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

export const wrapper = createWrapper<AppStore>(makeStore);