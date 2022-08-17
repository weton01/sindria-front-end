import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import StoreEditor from "@component/store/StoreEditor";
import { authRoute } from "middlewares/authRoute";
import { getAddress } from "services/address";
import { getStoreById } from "services/store";

const StoreEdit = (props) => {
  return (
    <div>
      <StoreEditor {...props} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    try {
      const { ["shop_token"]: token } = parseCookies(ctx); 
      const { id } = ctx.query;

      const [address, store] = await Promise.all([
        getAddress({ token, skip: 0, take: 10000 }),
        getStoreById({ token, id })
      ]);

      return {
        props: {
          address,
          store
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

StoreEdit.layout = DashboardLayout;

export default StoreEdit;
