import { createSlice } from "@reduxjs/toolkit";

import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface CategoryState {
  formated: any[],
  clean: any  []
}

const initialState: CategoryState = {
  formated: [],
  clean: []
}; 

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.clean = action.payload.clean
      state.formated = action.payload.formated 
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  }
});

export const { 
  setCategory
} = categorySlice.actions;
  
export const selectCategoryState = (state: AppState) => state.category;

export default categorySlice.reducer;