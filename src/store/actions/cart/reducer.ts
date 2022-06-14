import types from "./types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  invoiceType: "credit",
  description: "",
  address: {},
  creditCard: {},
  orderStores: []
};

const setTotalAmountByStore = (orderStores) => {
  let newStores = orderStores.map(ost => {
    ost.totalAmount = ost.shippingPrice.Valor

    ost.orderProducts.forEach(op => {
      ost.totalAmount += op.otherProps.netAmount

      op?.otherProps?.mutation?.variations?.forEach(v => {
        ost.totalAmount += v.netAmount
      })
    })
    return ost
  })

  return [...newStores]

}

const setStoreShippingPrice = (userId, price, orderStores) => {
  const newOrderStores = [...orderStores]

  const index = newOrderStores.findIndex(store =>
    store.userId === userId
  )

  if (index >= 0) {
    newOrderStores[index].shippingPrice = price
  }

  return newOrderStores
}

const recalculateShippingValues = (orderStores) => {
  let newStores = orderStores.map(ost => {
    ost.nVlPeso = 0;
    ost.nVlComprimento = 0;
    ost.nVlAltura = 0;
    ost.nVlLargura = 0;
    ost.nVlDiametro = 0;

    ost.orderProducts.forEach(op => {
      ost.nVlPeso += op.otherProps.weight * op.quantity;
      ost.nVlComprimento += op.otherProps.width * op.quantity;
      ost.nVlAltura += op.otherProps.height * op.quantity;
      ost.nVlLargura += op.otherProps.width * op.quantity;
      ost.nVlDiametro += op.otherProps.width * op.quantity;

      op?.otherProps?.mutation?.variations?.forEach(v => {
        ost.nVlPeso += v.weight * op.quantity;
        ost.nVlComprimento += v.width * op.quantity;
        ost.nVlAltura += v.height * op.quantity;
        ost.nVlLargura += v.width * op.quantity;
        ost.nVlDiametro += v.width * op.quantity;
      })
    })
    return ost
  })

  return [...newStores]
}

const newAddNewProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores]

  const index = newOrderStores.findIndex(store =>
    store.userId === item?.otherProps?.user?.id,
  )

  if (index >= 0) {
    newOrderStores[index].orderProducts = addNewProduct(
      item,
      newOrderStores[index].orderProducts
    )
  } else {
    newOrderStores.push({
      shippingPrice: { Valor: 0.0 },
      nVlAltura: 0,
      nVlComprimento: 0,
      nVlDiametro: 0,
      nVlLargura: 0,
      nVlPeso: 0,
      totalAmount: 0,
      userId: item?.otherProps?.user?.id,
      orderProducts: addNewProduct(
        item,
        []
      )
    })
  }

  return [...newOrderStores]
}

const addNewProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  if (foundIndex >= 0) {
    newOrderProducts[foundIndex].quantity += 1;
    newOrderProducts[foundIndex].netAmount += item.netAmount
    newOrderProducts[foundIndex].grossAmount += item.grossAmount
  }
  else {
    newOrderProducts.push({
      ...item,
      quantity: 1
    })
  }

  return newOrderProducts
}

const newRemoveProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores]

  const index = newOrderStores.findIndex(store =>
    store.userId === item?.otherProps?.user?.id
  )

  if (index >= 0) {
    newOrderStores[index].orderProducts = removeProduct(
      item,
      newOrderStores[index].orderProducts
    )
  }

  return newOrderStores

}

const removeProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  if (foundIndex >= 0) {
    newOrderProducts[foundIndex].quantity--;
    newOrderProducts[foundIndex].netAmount -= item.netAmount
    newOrderProducts[foundIndex].grossAmount -= item.grossAmount
  }
  return newOrderProducts
}

const newDeleteProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores]

  const index = newOrderStores.findIndex(store =>
    store.userId === item?.otherProps?.user?.id
  )

  if (index >= 0) {
    newOrderStores[index].orderProducts = deleteProduct(
      item,
      newOrderStores[index].orderProducts
    )
  }

  return newOrderStores
}

const deleteProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts]

  const foundIndex = newOrderProducts.findIndex(p =>
    p.product.id === item.product.id &&
    p.mutation.id === item.mutation.id
  )

  return newOrderProducts.filter((_p, index) =>
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
        orderStores: setTotalAmountByStore(
          recalculateShippingValues(
            newAddNewProduct(
              action.payload,
              state.orderStores
            )
          )
        )
      };

    case types.DELETE_FROM_CART:
      return {
        ...state,
        orderStores: setTotalAmountByStore(
          recalculateShippingValues(
            newDeleteProduct(
              action.payload,
              state.orderStores
            )
          )
        ),
      };

    case types.REMOVE_PRODUCT_FROM_CART:
      return {
        ...state,
        orderStores: setTotalAmountByStore(
          recalculateShippingValues(
            newRemoveProduct(
              action.payload,
              state.orderStores
            )
          )
        ),
      };

    case types.SET_SHIPPING:
      return {
        ...state,
        orderStores: setStoreShippingPrice(
          action.payload.user,
          action.payload.price,
          state.orderStores
        ),
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
      return {
        ...state,
        creditCard: action.payload,
      };

    case types.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };

    case types.CLEAR_CART:
      return initialState

    default:
      return state;
  }
};

export default reducer;
