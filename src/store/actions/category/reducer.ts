import types from "./types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  items: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    case types.SET_CATEGORY:
      return { items: action.payload };

    default:
      return state;
  }
};

export default reducer;
