import Footer from "@component/footer/Footer";
import Header from "@component/header/Header";
import MobileNavigationBar from "@component/mobile-navigation/MobileNavigationBar";
import Sticky from "@component/sticky/Sticky";
import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import StyledAppLayout from "./AppLayoutStyle";

type Categories =  {
  clean: any[],
  formated: any[]
}

type Props = {
  title?: string;
  categories?: Categories;
  navbar?: React.ReactChild;
};

const AppLayout: React.FC<Props> = ({
  children,
  navbar,
  categories,
  title = "React Next.js Ecommerce Template",
}) => {
  const dispatch = useDispatch();

  if (
    categories?.clean?.length === 0 && 
    categories?.formated?.length === 0
  )
    useEffect(() => {
      dispatch({
        type: "SET_CATEGORY",
        payload: categories,
      });
    }, [categories]);

  return (
    <StyledAppLayout>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Sticky fixedOn={0}>
        <Header />
      </Sticky>

      {navbar && <div className="section-after-sticky">{navbar}</div>}
      {!navbar ? (
        <div className="section-after-sticky">{children}</div>
      ) : (
        children
      )}

      <MobileNavigationBar />
      <Footer />
    </StyledAppLayout>
  );
};

export default AppLayout;
