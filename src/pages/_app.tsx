import ErrorBoundary from "@component/ErrorBoundary";
import DispatchInitialProps from "@component/DispatchInitialProps";
import { NextPage } from "next";
import NextApp from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { Fragment } from "react";
import { ToastContainer } from "react-nextjs-toast";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { getCategory } from "services/category";
import { ThemeProvider } from "styled-components";
import { useStore } from "../store";
import { GlobalStyles } from "../utils/globalStyles";
import { theme } from "../utils/theme";
import { parseCookies } from "nookies";

//Css
import "reactjs-popup/dist/index.css";
import "react-credit-cards/es/styles-compiled.css";
import "./_app.css";
import { wrapper } from "store/store";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

const App: NextPage = ({ Component, pageProps }: any) => {

  let Layout = Component.layout || Fragment;

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          property="og:url"
          content="https://bonik-react.vercel.app/landing"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="React Next JS Ecommerce Template" />
        <meta
          property="og:description"
          content="Minimal, clean and Fast Next js ecommerce template. Build Super store, Grocery delivery app, Multivendor store and niche market"
        />
        <meta
          property="og:image"
          content="/assets/images/landing/preview.png"
        />
      </Head>

      <GlobalStyles />
        <ErrorBoundary>
          <Layout>
            <div style={{ position: "absolute", zIndex: 99999 }}>
              <ToastContainer align={"right"} position={"bottom"} />
            </div>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
    </ThemeProvider>
  );
};

export default wrapper.withRedux(App);;
