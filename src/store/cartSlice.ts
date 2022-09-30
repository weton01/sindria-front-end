import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { AppState } from "./store"; 

const setDiscount = (orderStores, discount) => {
  let newOrderStores = [...orderStores]

  newOrderStores = newOrderStores?.map(ost => {
    console.log('here', ost.netAmount - (discount / orderStores.length), discount)
    ost.netAmount = ost.netAmount - (discount / orderStores.length)
    return ost
  })

  return newOrderStores;
}

const setFeeByStore = (orderStores, invoiceType) => {
  let newOrderStores = [...orderStores]

  newOrderStores = newOrderStores?.map(ost => {

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
    return ost
  })

  return [...newOrderStores];
};

const setNetValue = (orderStores) => {
  let newOrderStores = [...orderStores]

  newOrderStores = newOrderStores?.map(ost => {
    ost.netAmount = 0;
    ost.netAmount = ost.totalAmount + ost.shippingPrice.Valor
    return { ...ost }
  })

  return newOrderStores;
}

const setTotalAmountByStore = (orderStores) => {
  let newStores = orderStores?.map((ost) => {
    const newOst = { ...ost }
    newOst.orderProducts.forEach((op) => {
      newOst.totalAmount = (
        (op?.otherProps?.netAmount + op?.otherProps?.mutation.feeTotal) *
        op.quantity
      );
    });
    return newOst;
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
  let newStores = orderStores?.map((ost) => {
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

export interface CartState {
  invoiceType: string,
  description: string,
  address: { items: any[], count: number },
  creditCard: any,
  orderStores: any[],
  installments: number,
  coupon: { discount: number }
}

const initialState: CartState = {
  invoiceType: "CREDIT_CARD",
  description: "",
  address: { items: [], count: 0 },
  creditCard: {},
  orderStores: [],
  installments: 1,
  coupon: { discount: 0 }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    persistCart(state, action) {
      Object.keys(state).forEach(key => {
        state[key] = action.payload[key]
      })
    },

    addToCart(state, action) {
      state.orderStores = setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newAddNewProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType),
        state.coupon.discount)
    },

    deleteFromCart(state, action) {
      state.orderStores = setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newDeleteProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType), state.coupon.discount)
    },

    removeFromCart(state, action) {
      state.orderStores = setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                newRemoveProduct(action.payload, state.orderStores)
              )
            )
          ), state.invoiceType), state.coupon.discount)
    },

    selectPaymentType(state, action) {
      state.invoiceType = action.payload
      state.orderStores = setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              state.orderStores
            )
          ), state.invoiceType), state.coupon.discount)
    },

    selectAddress(state, action) {
      state.address = action.payload
    },

    selectCreditCard(state, action) {
      state.creditCard = action.payload
    },

    clearCart(state, action) {
      state = initialState
    },

    setShipping(state, action) {
      setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                setStoreShippingPrice(
                  action.payload.user,
                  action.payload.price,
                  state.orderStores
                ),
              )
            )
          ), state.invoiceType), state.coupon.discount)
    },

    setDescription(state, action) {
      state.description = action.payload
    },


    setInstallment(state, action) {
      state.installments = action.payload
    },

    setCoupon(state, action) {
      state.coupon = action.payload
      state.orderStores = setDiscount(
        setFeeByStore(
          setNetValue(
            setTotalAmountByStore(
              recalculateShippingValues(
                state.orderStores
              )
            )
          ), state.invoiceType), state.coupon.discount)
    },
  }, 
});

export const {
  addToCart,
  clearCart,
  deleteFromCart,
  removeFromCart,
  selectAddress,
  selectCreditCard,
  selectPaymentType,
  setCoupon,
  setDescription,
  setInstallment,
  setShipping,
  persistCart
} = cartSlice.actions;

export const selectAuthState = (state: AppState) => state.cart;

export default cartSlice.reducer;