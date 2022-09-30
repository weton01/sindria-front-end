import CustomerDashboardLayout from "@component/layout/CustomerDashboardLayout";
import CustomerOrderList from "@component/orders/CustomerOrderList";
import { ITEMS_PER_PAGE } from "@utils/enums";
import axios from "axios";
import { authRoute } from "middlewares/authRoute";
import { GetServerSideProps } from "next";
import React from "react";
import { PROD_URL } from "services/api";

const Orders = ({ orders }) => {
  return <CustomerOrderList orders={orders} />;
};

Orders.layout = CustomerDashboardLayout;

export const getServerSideProps: GetServerSideProps = async (c) => {
  return authRoute(c, async (ctx: any) => {
    try {
      const take = ITEMS_PER_PAGE.MAX;
      const { skip = 0 }: any = ctx.query;

      const { data } = await axios.get(`${PROD_URL}order/v1`, {
        params: { skip: skip, take: take, relations: "ordersStores" },
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      }); 

      const customData = data.items?.map((item) => {
        return {
          ...item,
          paymentStatus: "pending",
          totalValue: item.ordersStores.reduce(
            (accumulator, add) => accumulator + add.totalAmount,
            0
          ),
        };
      });

      return {
        props: {
          orders: { count: data.count, items: customData },
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

export default Orders;
