import Container from "@component/Container";
import NavbarLayout from "@component/layout/NavbarLayout";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import { api, PROD_URL } from "services/api";
import axios from "axios";
import { useRouter } from "next/router";
import { paymentStatusResult } from "@component/payment/PaymentStatus";

const Shop = ({ payment }) => {
  const [currentPayment, setCurrentPayment] = useState(payment);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const inteval = setInterval(async () => {
      // const result = await getPaymentById(id);
      //setCurrentPayment(result)
    }, 5000);

    return () => {
      clearInterval(inteval);
    };
  }, [setCurrentPayment]);
  
  return (
    <Container maxWidth={750}>
      {paymentStatusResult(currentPayment)}
    </Container>
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
