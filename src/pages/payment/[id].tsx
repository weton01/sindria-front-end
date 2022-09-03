import Container from "@component/Container";
import NavbarLayout from "@component/layout/NavbarLayout";
import React from "react";
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import { api, PROD_URL } from "services/api";
import axios from "axios";
import PixResult from "@component/payment/result/pix";

const Shop = ({ payment }) => { 
  console.log(payment);
   
  return (
    <Container maxWidth={750}>
      <PixResult payment={payment} />
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
