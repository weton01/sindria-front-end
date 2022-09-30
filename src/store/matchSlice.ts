import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { AppState } from "./store";

export interface MatchState {
  matches: any[]

}

const initialState: MatchState = {
  matches: []
};

const matchProductFnc = (id, matches) => {

  const foundMatch = matches?.find(item => item.id === id)

  if (foundMatch) {
    return matches?.filter(item => item.id !== id)
  }

  return [...matches, { id: id }]
}

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    matchProduct(state, action) {
      state.matches = matchProductFnc(action.payload, state.matches)
    },

    setInitialMatch(state, action) {
      state.matches = action.payload
    },
  }, 
});

export const {
  matchProduct,
  setInitialMatch
} = matchSlice.actions;

export const selectMatchState = (state: AppState) => state.match;

export default matchSlice.reducer;