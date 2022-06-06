import Avatar from "@component/avatar/Avatar";
import Card from "@component/Card";
import { Card1 } from "@component/Card1";
import CheckoutSummary2 from "@component/checkout/CheckoutSummary2";
import FlexBox from "@component/FlexBox";
import Typography, { H6, Paragraph } from "@component/Typography";
import axios from "axios";
import { GetServerSideProps } from "next";
import { Container } from "next/app";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { PROD_URL } from "services/api";
import Grid from "../../components/grid/Grid";
import CheckoutNavLayout from "../../components/layout/CheckoutNavLayout";

const Checkout = ({ address }) => {
  const [selectedAddress, setSelectedAddress] = useState({id: ''})

  useEffect(() => {
    setSelectedAddress(address.items[0])
  }, [address])

  return (
    <Container my="1.5rem">
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
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
              <Typography fontSize="20px">Detalhes do Envio</Typography>
            </FlexBox>

            <Typography mb="0.75rem">Endereço de Entrega</Typography>
            <Grid container spacing={6}>
              {address?.items.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={`addr-${ind}`}>
                  <Card
                    bg="gray.100"
                    p="1rem"
                    boxShadow="none"
                    border="1px solid"
                    cursor="pointer"
                    borderColor={
                      item.id === selectedAddress?.id
                        ? "primary.main"
                        : "transparent"
                    }
                    onClick={() => {
                      setSelectedAddress(item)
                    }}
                  >
                    <H6 mb="0.25rem">CEP: {item.cep}</H6>
                    <Paragraph color="gray.700">{item.street}, {item.number}, {item.neighborhood}</Paragraph>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card1>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </Container>
  );
};

Checkout.layout = CheckoutNavLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { ["shop_token"]: token } = parseCookies(ctx);

  try {
    const { data } = await axios.get(`${PROD_URL}address/v1`, {
      params: { skip: 0, take: 10 },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return {
      props: {
        address: data
      }
    }

  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/404"
      }
    }
  }
}


export default Checkout;
