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
import Icon from "@component/icon/Icon";
import { success, fail} from "@component/notification/notifcate";
import { PROD_URL } from "services/api";
import axios from "axios";
import { parseCookies } from "nookies";

const TranslatePaymentMethod = {
  credit: "Crédito",
  pix: "PIX",
  boleto: "Boleto",
}

const clearCart = (cart) => {
  const newCart = {...cart}
  newCart.orderProducts = newCart.orderProducts.map(i => {
    delete i.otherProps
    return i
  })

  newCart.address = {id: newCart.address.id}
  newCart.creditCard = {id: newCart.creditCard.id}

  return newCart
}

const CheckoutForm2 = () => {
  const [loading, setLoading] = useState(false)
  const cart = useSelector((selec: any) =>
    selec.cart
  );
  const cookies = parseCookies()

  const handleFormSubmit = async () => {
    setLoading(true);
    const newCart = clearCart(cart)
    console.log(newCart)
    try {
      const { data } = await axios.post(`${PROD_URL}order/v1`, newCart, {
        headers: {
          'Authorization': `Bearer ${cookies['shop_token']}`
        }
      })

      success('sucesso! por favor, aguarde enquanto processamos seu pagamento')
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
          <FlexBox alignItems="center">
            <Icon
            >
              {cart?.invoiceType}
            </Icon>
            <H6 ml="4px">{TranslatePaymentMethod[cart?.invoiceType]}</H6>
          </FlexBox>
        </Card>
        {
          cart?.invoiceType === 'credit' ? <>
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
                <img
                  width={45}
                  height={35}
                  src={`/assets/images/payment-methods/${cart?.creditCard?.type}.svg`}
                  alt={`${cart?.creditCard?.type}`}
                />
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
