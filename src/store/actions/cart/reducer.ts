import types from "./types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  invoiceType: "credit",
  address: {},
  creditCard: {},
  orderProducts: []
};

const addNewProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  if (foundIndex >= 0) {
    newOrderProducts[foundIndex].quantity += item.quantity;
    newOrderProducts[foundIndex].netAmount += item.netAmount
    newOrderProducts[foundIndex].grossAmount += item.grossAmount
  }
  else {
    newOrderProducts.push(item)
  }

  return newOrderProducts
}

const removeProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  if (foundIndex >= 0) {
    console.log(item)
    newOrderProducts[foundIndex].quantity--;
    newOrderProducts[foundIndex].netAmount -= item.netAmount
    newOrderProducts[foundIndex].grossAmount -= item.grossAmount
  }
  else {
    newOrderProducts.push(item)
  }

  return newOrderProducts
}

const deleteProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  return newOrderProducts.filter((p, index) =>
    index !== foundIndex
  )
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;

    case types.ADD_TO_CART:
      return {
        ...state,
        orderProducts: addNewProduct(
          action.payload,
          state.orderProducts
        )
      };

    case types.DELETE_FROM_CART:
      return {
        ...state,
        orderProducts: deleteProduct(
          action.payload,
          state.orderProducts
        )
      };

    case types.REMOVE_PRODUCT_FROM_CART:
      return {
        ...state,
        orderProducts: removeProduct(
          action.payload,
          state.orderProducts
        )
      };

    case types.SELECT_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };

    case types.SELECT_PAYMENT_TYPE:
      return {
        ...state,
        invoiceType: action.payload,
      };

    case types.SELECT_CREDIT_CARD:
      console.log(action.payload)
      return {
        ...state,
        creditCard: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
