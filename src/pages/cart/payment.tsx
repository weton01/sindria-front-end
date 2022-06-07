import axios from "axios";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { } from "react";
import { PROD_URL } from "services/api";
import Grid from "../../components/grid/Grid";
import CheckoutNavLayout from "../../components/layout/CheckoutNavLayout";
import PaymentForm from "@component/payment/PaymentForm";
import CheckoutSummary2 from "@component/checkout/CheckoutSummary2";

const Payment = ({ creditCards }) => {

  return (
    <Grid container flexWrap="wrap-reverse" spacing={6}>
      <Grid item lg={8} md={8} xs={12}>
        <PaymentForm creditCards={creditCards} />
      </Grid>
      <Grid item lg={4} md={4} xs={12}>
        <CheckoutSummary2 />
      </Grid>
    </Grid>
  );
};

Payment.layout = CheckoutNavLayout;


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);

  try {
    const { data } = await axios.get(`${PROD_URL}credit-card/v1`, {
      params: { skip: 0, take: 10, orderBy: 'DESC' },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return {
      props: {
        creditCards: data
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

export default Payment;
