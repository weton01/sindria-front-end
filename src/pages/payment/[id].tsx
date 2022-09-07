import Container from "@component/Container";
import NavbarLayout from "@component/layout/NavbarLayout";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import { api, PROD_URL } from "services/api";
import axios from "axios";
import PixResult from "@component/payment/result/pix";
import BoletoResult from "@component/payment/result/boleto";
import CardResult from "@component/payment/result/card";
import { getPaymentById } from "services/payment";
import { useRouter } from "next/router";

const Shop = ({ payment }) => {
  const [paymentActual, setPaymentActual] = useState(payment)
  const router = useRouter();
  const { id } = router.query; 

  useEffect(() => {
    const inteval = setInterval(async () => {
      const result = await getPaymentById(id);
      setPaymentActual(result)
    }, 5000);

    return () => {
      clearInterval(inteval);
    };
  }, [setPaymentActual]);

  const methodResult = {
    PIX: <PixResult payment={paymentActual} />,
    BOLETO: <BoletoResult payment={paymentActual} />,
    CREDIT_CARD: <CardResult payment={paymentActual} />,
  };

  return (
    <Container maxWidth={750}>{methodResult[payment.billingType]}</Container>
  );
};

Shop.layout = NavbarLayout;

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    const { id } = ctx.query;

    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${ctx.token}`;
      return config;
    });

    const { data } = await axios.get(`${PROD_URL}payment/v1/${id}`);

    return {
      props: {
        payment: data,
      },
    };
  });
};
export default Shop;
