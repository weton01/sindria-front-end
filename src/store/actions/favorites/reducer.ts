import types from "./types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  matches: []
};

const matchProduct = (id, matches) => {

  const foundMatch = matches?.find(item => item.id === id)

  if (foundMatch) {
    return matches?.filter(item => item.id !== id)
  }

  return [...matches, { id: id }]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;

    case types.MATCH_PRODUCT:
      return {
        ...state,
        matches: matchProduct(action.payload, state.matches)
      };
    
    case types.SET_INITIAL_MATCH:
      return { 
        ...state,
        matches: action.payload
      }

    default:
      return state;
  }
};

export default reducer;
