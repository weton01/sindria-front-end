import React from "react";
import DashboardLayout from "@component/layout/CustomerDashboardLayout";
import SubcategoryEditor from "@component/subcategory/SubcategoryEditor";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { api } from "services/api";

const NewSubcategory = (props) => {
  return (
    <div>
      <SubcategoryEditor {...props} />
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

    const { data } = await api.get(`category/v1/`);
    const newData = data.map(item=>{
      return {
        label: item.name,
        value:item.id
      }
    })  
    
    return {
      props: { options: newData },
    };
  } catch (err) {
    console.log("fail to verify tokens", err);
  }

  return {
    props: {},
  };
};

NewSubcategory.layout = DashboardLayout;

export default NewSubcategory;
