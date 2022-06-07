import Box from "@component/Box";
import { useSelector } from "react-redux";
import React from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";
import { formatCurrency } from "@utils/formatCurrency";

const calculateCartSubTotal = (orderProducts): number => {
  let subTotal: number = 0;
  orderProducts?.forEach((item) => {
    subTotal += item?.netAmount 
  })
  return subTotal
}


const calculateDiscount = (cartP) => {
  const subTotal: number = calculateCartSubTotal(cartP.orderProducts);
  
  if(cartP?.invoiceType === 'credit'){
    return subTotal * 0
  }

  if(cartP?.invoiceType === 'pix'){
    return subTotal * 0.01
  }

  if(cartP?.invoiceType === 'boleto'){
    return subTotal * 0.048
  }
}

const CheckoutSummary2: React.FC = () => {
  const cart = useSelector((selec: any) =>
    selec.cart
  );

  const sort = (m, n) => {
    if (m.type > n.type) {
      return -1
    }
  }

  const renderSize = (size) => {
    return <Box
      size={25}
      width={25}
      padding={"4px"}
      bg="white"
      display="flex"
      borderRadius="5px"
      justifyContent="center"
      alignItems="center"
      border="1px solid"
      borderColor={"gray.400"}
    >
      {size}
    </Box>
  }

  const renderColor = (color) => {
    return <Box
      width="100%"
      height="100%"
      backgroundColor={color}
      borderRadius="50%"
    />
  }

  const renderDefault = (defa) => {
    return <Typography fontSize={12}>
      {defa}
    </Typography>
  }

  const subTotal = calculateCartSubTotal(cart.orderProducts)
  const discount = calculateDiscount(cart)

  return (
    <Box>
      <Typography color="secondary.900" fontWeight="700" mb="1.5rem">
        Seu Pedido
      </Typography>

      {cart?.orderProducts?.map((item) => (
        <FlexBox flexDirection="column" mb="1.5rem">
          <FlexBox
            justifyContent="space-between"
            alignItems="center"

            key={item?.mutation?.id}
          >
            <Typography>
              <Span fontWeight="700" fontSize="14px">
                {item?.quantity}
              </Span>{" "}
              x {item?.otherProps?.title}
            </Typography>
            <Typography>{formatCurrency(item?.netAmount)}</Typography>
          </FlexBox>
          <FlexBox gap={6} alignItems="center">
            {item?.otherProps?.mutation?.variations?.sort(sort).map(v => <>
              {v.type === "size" ? renderSize(v.size) : null}
              {v.type === "color" ? renderColor(v.color) : null}
              {v.type === "default" ? renderDefault(v.name) : null}
            </>
            )}
          </FlexBox>

        </FlexBox>
      ))}

      <Divider bg="gray.300" mb="1.5rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>
        <Typography fontWeight="700">{formatCurrency(subTotal)}</Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Entrega:</Typography>
        <Typography fontWeight="700">-</Typography>
      </FlexBox>


      <FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
        <Typography color="text.hint">Desconto:</Typography>
        <Typography fontWeight="700">{formatCurrency(discount)}</Typography>
      </FlexBox>

      <Divider bg="gray.300" mb="0.5rem" />

      <FlexBox
        fontWeight="700"
        justifyContent="space-between"
        alignItems="center"
        mb="0.5rem"
      >
        <Typography>Total:</Typography>
        <Typography fontWeight="700">{formatCurrency(subTotal - discount)}</Typography>
      </FlexBox>
    </Box>
  );
};

const cartList = [
  {
    name: "iPhone 12",
    quantity: 1,
    price: 999,
  },
  {
    name: "iPhone 12 pro",
    quantity: 1,
    price: 1199,
  },
  {
    name: "iPhone 12 pro max",
    quantity: 1,
    price: 1299,
  },
];

export default CheckoutSummary2;
