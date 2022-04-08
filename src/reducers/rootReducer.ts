import { cartActionType, cartInitialState, cartReducer } from "./cartReducer";
import { authReducer, userActionType, userInitialState } from "./authReducer";
import {
  layoutActionType,
  layoutInitialState,
  layoutReducer,
} from "./layoutReducer";

import combineReducers from "./combineReducers";

export type rootActionType = layoutActionType | cartActionType | userActionType;

export const initialState = {
  layout: layoutInitialState,
  cart: cartInitialState,
  auth: userInitialState,
};

export const rootReducer = combineReducers({
  layout: layoutReducer,
  cart: cartReducer,
  auth: authReducer,
});
