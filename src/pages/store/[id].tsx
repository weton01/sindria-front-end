import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import BrandsEditor from "@component/brands/BrandsForm";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { api } from "services/api";

const Brands = (props) => {
  return (
    <div>
      <BrandsEditor {...props}/>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  const {id} = ctx.query;
  
  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const { data } = await api.get(`brand/v1/${id}`); 
    
    return {
      props: { data: data },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

Brands.layout = DashboardLayout;

export default Brands;
