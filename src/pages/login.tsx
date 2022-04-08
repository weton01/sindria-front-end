import { GetServerSideProps } from "next";
import React from "react";
import FlexBox from "../components/FlexBox";
import Login from "../components/sessions/Login";
import { parseCookies  } from "nookies";
import { PassThrough } from "stream";

const LoginPage = () => {
  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Login />
    </FlexBox>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token'] : token } = parseCookies(ctx)

  return { 
    props: {}
  }
}

 
export default LoginPage;
