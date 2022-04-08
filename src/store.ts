import { useMemo } from "react";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension"; 
import { persistReducer } from 'redux-persist'
import reducer from "./store/actions/user/reducer";
import { createLogger } from "redux-logger";
import storage from 'redux-persist/lib/storage';
 

let store; 
const logger = createLogger({});
const middlewares = [];
const initialState = {};
const persistConfig = {
  key: 'root',
  storage,
  blacklist:  [], 
  timeout : null , 
}

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}
const reducers = combineReducers({
  user: reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers)

function initStore(preloadedState = initialState) {
  return createStore(
    persistedReducer, 
    preloadedState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
