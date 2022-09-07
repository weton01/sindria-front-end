import CheckoutForm2 from "@component/checkout/CheckoutForm2";
import CheckoutSummary2 from "@component/checkout/CheckoutSummary2";
import Container from "@component/Container";
import CheckoutNavLayout from "@component/layout/CheckoutNavLayout";
import axios from "axios";
import { authRoute } from "middlewares/authRoute";
import { GetServerSideProps } from "next";
import React from "react";
import { PROD_URL } from "services/api";
import Grid from "../../components/grid/Grid";

const CheckoutAlternative = ({ coupons }) => {
  return (
    <Container my="1.5rem">
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm2 data={coupons} />
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </Container>
  );
};

CheckoutAlternative.layout = CheckoutNavLayout;

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async ({ token }: any) => {
    try {
      const { data } = await axios.get(`${PROD_URL}coupon/v1?skip=0&take=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        props: {
          coupons: data,
        },
      };
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/404",
        },
      };
    }
  });
};

export default CheckoutAlternative;
