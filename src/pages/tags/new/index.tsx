import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import TagsEditor from "@component/tags/TagEditor";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { api } from "services/api";

const Tags = (props) => {
  return (
    <div>
      <TagsEditor {...props}/>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["shop_token"]: token } = parseCookies(ctx);
  
  try {
    api.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    const { data } = await api.get(`tag/v1`); 
    
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

Tags.layout = DashboardLayout;

export default Tags;
