import Avatar from "@component/avatar/Avatar";
import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import React, { useState } from "react";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import Grid from "../grid/Grid";
import Typography, { H6, Paragraph } from "../Typography";
import { useSelector } from "react-redux";
import Icon, { IconType } from "@component/icon/Icon";
import { fail, success } from "@component/notification/notifcate";
import { PROD_URL } from "services/api";
import axios from "axios";
import { parseCookies } from "nookies";
import { useAppDispatch } from "@hook/hooks";
import { useRouter } from "next/router";
import { ShippingTypes } from "@component/shipping/shipping";
import { formatCurrency } from "@utils/formatCurrency";
import Divider from "@component/Divider";
import { formatFloat } from "@utils/formatFloat";

const TranslatePaymentMethod = {
  credit: "Crédito",
  pix: "PIX",
  boleto: "Boleto",
}

function addDaysWRONG(date: Date, days: any): Date {
  const result = new Date();
  result.setDate(date.getDate() + days);
  return result;
}

const clearCart = (cart) => {
  const newCart = { ...cart }
  newCart.orderStores = [...newCart.orderStores]

  if (cart.invoiceType === 'BOLETO') {
    newCart.installments = 1
  }

  delete newCart.fee
  newCart.orderStores = newCart.orderStores.map(ost => {
    const { trackingEstimated } = ost?.shippingPrice

    ost.store = { id: ost.storeId }
    ost.description = cart.description
    ost.shippingAmount = ost?.shippingPrice?.Valor
    ost.totalAmount = ost?.netAmount
    ost.orderProducts = ost.orderProducts.map(item => {
      delete item.otherProps
      return item
    })

    ost.trackingEstimated = addDaysWRONG(
      new Date(),
      formatFloat(trackingEstimated)
    ).toISOString()


    delete ost.nVlAltura
    delete ost.nVlComprimento
    delete ost.nVlDiametro
    delete ost.nVlLargura
    delete ost.nVlPeso
    delete ost.userId
    delete ost.shippingPrice
    delete ost.storeName
    delete ost.storeId
    delete ost.netAmount
    return ost
  })

  delete newCart.description

  newCart.address = { id: newCart.address.id }
  newCart.creditCard = { id: newCart.creditCard.id }

  return newCart
}

const CheckoutForm2 = () => {
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch();
  const router = useRouter();

  const cart = useSelector((selec: any) =>
    selec.cart
  );

  const cookies = parseCookies()

  const handleFormSubmit = async () => {
    setLoading(true);
    const newCart = clearCart(cart)

    try {
      await axios.post(`${PROD_URL}order/v1`, newCart, {
        headers: {
          'Authorization': `Bearer ${cookies['shop_token']}`
        }
      })

      router.push("/");

      dispatch({
        type: "CLEAR_CART",
        payload: {}
      })

      success('success')
    } catch (err) {
      fail(err?.response?.data?.message)
    }
    setLoading(false);
  };


  return (
    <Box>
      <Card1 mb="1.5rem">
        <FlexBox alignItems="center" mb="1.75rem">
          <Avatar
            bg="primary.main"
            size={32}
            color="primary.text"
            mr="0.875rem"
          >
            1
          </Avatar>
          <Typography fontSize="20px">Detalhes de Entrega</Typography>
        </FlexBox>

        <Typography mb="0.75rem">Endereço de entrega</Typography>

        <Card
          bg="gray.100"
          p="1rem"
          boxShadow="none"
          border="1px solid"
          borderColor="transparent"
        >
          <H6 mb="0.25rem">CEP: {cart?.address?.cep}</H6>
          <Paragraph color="gray.700">{cart?.address?.street}, {cart?.address?.number}, {cart?.address?.neighborhood}</Paragraph>
        </Card>
      </Card1>

      <Card1 mb="1.5rem">
        <FlexBox alignItems="center" mb="1.75rem">
          <Avatar
            bg="primary.main"
            size={32}
            color="primary.text"
            mr="0.875rem"
          >
            2
          </Avatar>
          <Typography fontSize="20px">Detalhes do Envio</Typography>
        </FlexBox>

        <Typography mb="0.75rem">Lojas e Preços</Typography>

        {
          cart?.orderStores?.map((item, index) => {
            return (
              <React.Fragment key={`fx-1-${index}`}
              >
                <FlexBox
                  p={10}
                  width="100%"
                  backgroundColor="#F6F9FC"
                  gap={12}
                  justifyContent="center"
                  flexDirection="column"
                >
                  <H6 >
                    Produtos da Loja: {item?.storeName}
                  </H6>
                  <FlexBox alignItems="center" gap={12}>
                    <FlexBox width="100%" alignItems="center" gap={10}>
                      <Icon size="45px" color="secondary">
                        {ShippingTypes[item?.shippingPrice?.Codigo]?.icon}
                      </Icon>
                      <Typography fontSize={13}>
                        <strong>Tipo de Envio:</strong> {ShippingTypes[item?.shippingPrice?.Codigo]?.type}
                      </Typography>
                      <Typography fontSize={13}>
                        <strong>Tempo de Entrega:</strong> {item?.shippingPrice?.PrazoEntrega} dias úteis
                      </Typography>
                      <Typography fontSize={13}>
                        <strong>Preço:</strong> {formatCurrency(item.shippingPrice?.Valor)}
                      </Typography>
                    </FlexBox>

                  </FlexBox>
                </FlexBox>{
                  index !== cart.orderStores.length - 1 ? (
                    <Divider
                      bg="gray.300" mb="0.5rem" />
                  ) : null
                }
              </React.Fragment>
            )
          })
        }
      </Card1>

      <Card1 mb="1.5rem">
        <FlexBox alignItems="center" mb="1.75rem">
          <Avatar
            bg="primary.main"
            size={32}
            color="primary.text"
            mr="0.875rem"
          >
            3
          </Avatar>
          <Typography fontSize="20px">Informações de Pagamento</Typography>
        </FlexBox>

        <Typography mb="0.75rem">Método de Pagamento</Typography>
        <Card
          bg="gray.100"
          p="1rem"
          boxShadow="none"
          border="1px solid"
          borderColor="transparent"
          mb="1rem"
          display="flex"
        >
          <FlexBox alignItems="center" gap={4}>
            <Icon
            >
              {cart?.invoiceType}
            </Icon>
            <H6 ml="4px">{TranslatePaymentMethod[cart?.invoiceType]}</H6>
            {
              cart?.invoiceType === 'PIX' ? <>
                PIX
              </>
                : null
            }
          </FlexBox>
        </Card>
        {
          cart?.invoiceType === 'CREDIT_CARD' ? <>
            <Typography mb="0.75rem">Cartão de crédito</Typography>

            <Card
              bg="gray.100"
              p="1rem"
              boxShadow="none"
              border="1px solid"
              borderColor="transparent"
            >
              <H6 mb="0.25rem">{cart?.creditCard?.number}</H6>
              <FlexBox width="100%" ml={0} alignItems="center" justifyContent="space-between">
                <Paragraph color="gray.700">
                  {cart?.creditCard?.expirationDate}</Paragraph>

                <Icon
                  typer={IconType["payment-card"]}
                >
                  {cart?.creditCard?.type}
                </Icon>
              </FlexBox>
            </Card>
          </>
            : null
        }



      </Card1>

      <Grid>
        <Button
          variant="contained"
          color="primary"
          mt="1.5rem"
          type="submit"
          fullwidth
          loading={loading}
          onClick={handleFormSubmit}
        >
          Fazer Pedido
        </Button>
      </Grid>
    </Box >

  );
};

export default CheckoutForm2;
