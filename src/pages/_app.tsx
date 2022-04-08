import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { Fragment } from "react";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "../contexts/app/AppContext";
import { GlobalStyles } from "../utils/globalStyles";
import { theme } from "../utils/theme";
import { useStore } from "../store";  
import { persistStore } from 'redux-persist'
import { PersistGate } from "redux-persist/integration/react";
import {NextPage} from 'next'
import { Provider } from "react-redux";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

const App : NextPage = ({ Component, pageProps }: any) => {
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function () {
    persistor.persist()
  })
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
          <Layout>
            <Component {...pageProps}  />
          </Layout>
        </PersistGate>
        </Provider>
      </AppProvider>
    </ThemeProvider>
  );
};

 

export default  App;
