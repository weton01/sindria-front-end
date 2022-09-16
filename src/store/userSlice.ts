import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { AppState } from "./store"; 
export interface AuthState {
  isLogged: boolean,
  token: string,
  email: string,
}

const initialState: AuthState = {
  isLogged: false,
  token: "",
  email: "",
}; 

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSignin(state, action) {
      state = { ...action.payload, isLogged: true }
    },

    userSignup(state, action) {
      state = { ...action.payload, isLogged: true }
    },

    userLogout(state, action) {
      state = initialState
    },

    userRecoverPassword(state, action) {
      state = action.payload;
    },

    userRecoverPasswordCb(state, action) {
      state = action.payload;
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
  userSignin,
  userSignup,
  userLogout,
  userRecoverPassword,
  userRecoverPasswordCb
} = authSlice.actions;
  
export const selectAuthState = (state: AppState) => state.user;

export default authSlice.reducer;