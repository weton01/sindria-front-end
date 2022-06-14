import Box from "@component/Box";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { formatFloat } from "@utils/formatFloat";

const calculateCartSubTotal = (orderProducts): number => {
  let subTotal: number = 0;
  orderProducts?.forEach((item) => {
    subTotal += item?.netAmount
  })
  return subTotal
}

const calculateDiscount = (cartP, products) => {
  const subTotal: number = calculateCartSubTotal(products);

  if (cartP?.invoiceType === 'credit') {
    return subTotal * 0
  }

  if (cartP?.invoiceType === 'pix') {
    return subTotal * 0.01
  }

  if (cartP?.invoiceType === 'boleto') {
    return subTotal * 0.048
  }
}

const calculateShippingPrice = (orderStores) => { 
  let total: number = 0;

  orderStores.forEach((i) => {
    console.log(i?.shippingPrice?.Valor)
    total += formatFloat(i?.shippingPrice?.Valor) | 0
  })

  return total
}

const CheckoutSummary2: React.FC = () => {
  const [products, setProducts] = useState([])

  const cart = useSelector((selec: any) =>
    selec.cart
  );

  const sort = (m, n) => {
    if (m.type > n.type) {
      return -1
    }
  }

  useEffect(() => {
    let newProducts = [];

    cart?.orderStores?.forEach(ost => {
      newProducts = [...newProducts, ...ost.orderProducts]
    })

    setProducts(newProducts)
  }, [cart, setProducts])


  const renderSize = (size, index) => {
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
      key={`prdsize-smary-${index}`}
    >
      {size}
    </Box>
  }

  const renderColor = (color, index) => {
    return <Box
      width="20px"
      height="20px"
      backgroundColor={color}
      borderRadius="50%"
      key={`prdcolor-smary-${index}`}
    />
  }

  const renderDefault = (defa, index) => {
    return <Typography fontSize={12} key={`prdfault-smary-${index}`}>
      {defa}
    </Typography>
  }

  const subTotal = calculateCartSubTotal(products)
  const discount = calculateDiscount(cart, products)
  const shippingPrice = calculateShippingPrice(cart.orderStores)

  return (
    <Box>
      <Typography color="secondary.900" fontWeight="700" mb="1.5rem">
        Seu Pedido
      </Typography>

      {products?.map((item, index) => (
        <FlexBox flexDirection="column" mb="1.5rem" key={`prd-smary-${index}`}>
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
              {v.type === "size" ? renderSize(v.size, index) : null}
              {v.type === "color" ? renderColor(v.color, index) : null}
              {v.type === "default" ? renderDefault(v.name, index) : null}
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
        <Typography fontWeight="700">{formatCurrency(shippingPrice)}</Typography>
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
        <Typography fontWeight="700">{formatCurrency(subTotal - discount + shippingPrice)}</Typography>
      </FlexBox>
    </Box>
  );
};


export default CheckoutSummary2;
