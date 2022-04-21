import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import NextApp from "next/app";
import React, { Fragment } from "react";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "../contexts/app/AppContext";
import { GlobalStyles } from "../utils/globalStyles";
import { theme } from "../utils/theme";
import { useStore } from "../store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { NextPage } from "next";
import { Provider } from "react-redux";
import { ToastContainer } from "react-nextjs-toast";
import "reactjs-popup/dist/index.css";
import "./_app.css";
import "react-credit-cards/es/styles-compiled.css";
import { parseCookies } from "nookies";
import { api } from "services/api";
import { getCategory } from "services/category";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

const App: NextPage = ({ Component, pageProps, categories }: any) => {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });
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
      <AppProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={<div>Loading</div>}>
            <Layout categories={categories}>
              <div style={{ position: "absolute", zIndex: 99999 }}>
                <ToastContainer align={"right"} position={"bottom"} />
              </div>
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </Provider>
      </AppProvider>
    </ThemeProvider>
  );
};

App.getInitialProps = async (appContext: any) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const { ["shop_token"]: token } = parseCookies(appContext);

  api.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });
  const [categories] = await Promise.all([getCategory()]);

  const newData = categories.map((item) => {
    const groupNames = item.subCategories.map((aux) => aux.groupName);
    const newCategories = [...new Set(groupNames)];
    
    return {
      icon: item.image,
      title: item.name,
      href: `/${item.name}`,
      menuComponent: "MegaMenu1",
      menuData: {
        categories: newCategories.map((aux) => ({
          title: aux,
          subCategories: item.subCategories
            .filter((subs) => subs.groupName === aux)
            .map((subs) => ({ title: subs.name, href: `/${item.name}/${subs.name}` })),
          href: "/",
        })),
      },
    };
  });

  return { ...appProps, categories: newData };
};

export default App;
