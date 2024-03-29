import CategoryEditor from "@component/categories/CategoryEditor";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import { api } from "services/api";

const UpdateCategory = (props) => {
  return <CategoryEditor {...props} />;
};

UpdateCategory.layout = DashboardLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  const { id } = ctx.query;

  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const { data } = await api.get(`category/v1/${id}`);

    return {
      props: { data: data },
    };
  } catch (err) {
  }

  return {
    props: {},
  };
};

export default UpdateCategory;
