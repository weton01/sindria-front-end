import {
  USER_SIGN_IN,
  USER_SIGN_UP,
  USER_LOGOUT,
  USER_RECOVER_PASSWORD,
  USER_RECOVER_PASSWORD_CALLBACK,
} from "../index";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  isLogged: false,
  token: "",
  email: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    case USER_SIGN_IN:
      localStorage.setItem("shop_token", action.payload.token);
      return { ...action.payload, isLogged: true };
    case USER_SIGN_UP:
      return action.payload;
    case USER_LOGOUT:
      localStorage.removeItem("shop_token");
      return initialState;
    case USER_RECOVER_PASSWORD:
      return action.payload;
    case USER_RECOVER_PASSWORD_CALLBACK:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
