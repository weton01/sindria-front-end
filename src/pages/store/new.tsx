import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import React, {  } from "react";
import Button from '@component/buttons/Button';
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import { GetServerSideProps } from "next";
import { authRoute } from "middlewares/authRoute";
import axios from "axios";
import { PROD_URL } from "services/api";
import StoreForm from "@component/store/StoreForm";

const Store = ({ address }) => { 
  return (
    <div>
      <DashboardPageHeader
        title={`Criar Loja`}
        iconName="home"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            route="/store"
          >
            Voltar para produtos
          </Button>
        }
      />  
      <StoreForm address={address}/> 
    </div>
  );
};

Store.layout = DashboardLayout;
 
export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    try {
      const { data } = await axios.get(`${PROD_URL}address/v1`, {
        params: { skip: 0, take: 10, orderBy: 'DESC' },
        headers: {
          'Authorization': `Bearer ${ctx.token}`
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
  })
}

export default Store;
