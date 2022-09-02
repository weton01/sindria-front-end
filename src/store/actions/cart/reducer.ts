import types from "./types";
import { HYDRATE } from "next-redux-wrapper"

const initialState = {
  invoiceType: "CREDIT_CARD",
  description: "",
  address: { items: [], count: 0 },
  creditCard: {},
  orderStores: [],
  installments: 1
};

const setFeeByStore = (orderStores, invoiceType) => {
  const newOrderStores = [...orderStores]

  newOrderStores.map(ost => {

    if (invoiceType === "CREDIT_CARD") {
      ost.feeAmount = ((ost.netAmount * 0.035) + 0.49)
      ost.netAmount = ost.netAmount + ost.feeAmount
    }

    if (invoiceType === "BOLETO") {
      ost.feeAmount = (1.99)
      ost.netAmount = ost.netAmount + ost.feeAmount
    }

    if (invoiceType === "PIX") {
      ost.feeAmount = (ost.netAmount * 0.01)
      ost.netAmount = ost.netAmount + ost.feeAmount
    }

  })

  return [...newOrderStores];
};

const setNetValue = (orderStores) => {
  const newOrderStores = [...orderStores]

  newOrderStores.map(ost => {
    ost.netAmount = ost.totalAmount + ost?.shippingPrice?.Valor
  })

  return newOrderStores;
}

const setTotalAmountByStore = (orderStores) => {
  let newStores = orderStores.map((ost) => {
    ost.orderProducts.forEach((op) => {
      ost.totalAmount += (
        (op?.otherProps?.netAmount + op?.otherProps?.mutation.feeTotal) *
        op.quantity
      );
    });
    return ost;
  });

  return [...newStores];
};

const setStoreShippingPrice = (userId, price, orderStores) => {
  const newOrderStores = [...orderStores];

  const index = newOrderStores.findIndex((store) => store.userId === userId);

  if (index >= 0) {
    newOrderStores[index].shippingPrice = price;
  }

  return newOrderStores;
};

const recalculateShippingValues = (orderStores) => {
  let newStores = orderStores.map((ost) => {
    ost.nVlPeso = 0;
    ost.nVlComprimento = 0;
    ost.nVlAltura = 0;
    ost.nVlLargura = 0;
    ost.nVlDiametro = 0;

    ost.orderProducts.forEach((op) => {
      ost.nVlPeso += op.otherProps.weight * op.quantity;
      ost.nVlComprimento += op.otherProps.width * op.quantity;
      ost.nVlAltura += op.otherProps.height * op.quantity;
      ost.nVlLargura += op.otherProps.width * op.quantity;
      ost.nVlDiametro += op.otherProps.width * op.quantity;

      op?.otherProps?.mutation?.variations?.forEach((v) => {
        ost.nVlPeso += v.weight * op.quantity;
        ost.nVlComprimento += v.width * op.quantity;
        ost.nVlAltura += v.height * op.quantity;
        ost.nVlLargura += v.width * op.quantity;
        ost.nVlDiametro += v.width * op.quantity;
      });
    });
    return ost;
  });

  return [...newStores];
};

const newAddNewProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores];

  const index = newOrderStores.findIndex(
    (store) => store.userId === item?.otherProps?.user?.id
  );

  if (index >= 0) {
    newOrderStores[index].orderProducts = addNewProduct(
      item,
      newOrderStores[index].orderProducts
    );
  } else {
    newOrderStores.push({
      shippingPrice: { Valor: 0.0, Codigo: '', PrazoEntrega: 1 },
      nVlAltura: 0,
      nVlComprimento: 0,
      nVlDiametro: 0,
      nVlLargura: 0,
      nVlPeso: 0,
      totalAmount: 0,
      userId: item?.otherProps?.user?.id,
      storeName: item?.otherProps?.store.name,
      storeId: item?.otherProps?.store.id,
      orderProducts: addNewProduct(item, []),
    });
  }

  return [...newOrderStores];
};

const addNewProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts];

  const foundIndex = newOrderProducts.findIndex(
    (p) =>
      p.product.id === item.product.id && p.mutation.id === item.mutation.id
  );

  if (foundIndex >= 0) {
    newOrderProducts[foundIndex].quantity += item.quantity;
    newOrderProducts[foundIndex].netAmount += item.netAmount
    newOrderProducts[foundIndex].grossAmount += item.grossAmount
  }
  else {
    newOrderProducts.push({
      ...item,
      quantity: item.quantity
    })
  }

  return newOrderProducts;
};

const newRemoveProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores];

  const index = newOrderStores.findIndex(
    (store) => store.userId === item?.otherProps?.user?.id
  );

  if (index >= 0) {
    newOrderStores[index].orderProducts = removeProduct(
      item,
      newOrderStores[index].orderProducts
    );
  }

  if (index >= 0) {
    if (newOrderStores[index].orderProducts.length === 0) {
      return newOrderStores.filter(
        (store) => store.userId !== item?.otherProps?.user?.id
      )
    }
  }

  return newOrderStores;
};

const removeProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts];

  const foundIndex = newOrderProducts.findIndex(
    (p) =>
      p.product.id === item.product.id && p.mutation.id === item.mutation.id
  );

  if (foundIndex >= 0) {
    newOrderProducts[foundIndex].quantity--;
    newOrderProducts[foundIndex].netAmount -= item.netAmount;
    newOrderProducts[foundIndex].grossAmount -= item.grossAmount;
  }
  return newOrderProducts;
};

const newDeleteProduct = (item, orderStores) => {
  const newOrderStores = [...orderStores];

  const index = newOrderStores.findIndex(
    (store) => store.userId === item?.otherProps?.user?.id
  );

  if (index >= 0) {
    newOrderStores[index].orderProducts = deleteProduct(
      item,
      newOrderStores[index].orderProducts
    );
  }

  if (index >= 0) {
    if (newOrderStores[index].orderProducts.length === 0) {
      return newOrderStores.filter(
        (store) => store.userId !== item?.otherProps?.user?.id
      )
    }
  }

  return newOrderStores;
};

const deleteProduct = (item, orderProducts) => {
  const newOrderProducts = [...orderProducts];

  const foundIndex = newOrderProducts.findIndex(
    (p) =>
      p.product.id === item.product.id && p.mutation.id === item.mutation.id
  );

  return newOrderProducts.filter((_p, index) => index !== foundIndex);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;

    case types.ADD_TO_CART:
      return {
        ...state,
        orderStores: setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newAddNewProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType),
      };

    case types.SET_FEE:
      return {
        ...state,
        fee: action.payload
      }

    case types.DELETE_FROM_CART:
      return {
        ...state,
        orderStores: setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newDeleteProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType
        ),
      };

    case types.REMOVE_PRODUCT_FROM_CART:
      return {
        ...state,
        orderStores: setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newRemoveProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType)
      };

    case types.SET_SHIPPING:
      return {
        ...state,
        orderStores: setFeeByStore(
          setNetValue(
            setStoreShippingPrice(
              action.payload.user,
              action.payload.price,
              state.orderStores
            ),
          ), state.invoiceType)
      };

    case types.SELECT_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };

    case types.SET_INSTALLMENT:
      return {
        ...state,
        installments: action.payload,
      };

    case types.DELETE_ADDRESS:
      const address = state.address.items.filter(
        (_, index) => index !== action.payload
      );
      return {
        ...state,
        address: { address, count: address.length }
      };

    case types.SELECT_PAYMENT_TYPE:
      return {
        ...state,
        invoiceType: action.payload,
        orderStores: setFeeByStore(setNetValue(state.orderStores), action.payload)
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
      return initialState;

    default:
      return state;
  }
};

export default reducer;
