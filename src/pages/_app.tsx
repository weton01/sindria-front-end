import ErrorBoundary from "@component/ErrorBoundary";
import DispatchInitialProps from "@component/DispatchInitialProps";
import withAuth from "@component/withAuth";
import { NextPage } from "next";
import NextApp from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { Fragment, useState } from "react";
import "react-credit-cards/es/styles-compiled.css";
import { ToastContainer } from "react-nextjs-toast";
import { Provider } from "react-redux";
import "reactjs-popup/dist/index.css";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { getCategory } from "services/category";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "../contexts/app/AppContext";
import { useStore } from "../store";
import { GlobalStyles } from "../utils/globalStyles";
import { theme } from "../utils/theme";
import "react-datepicker/dist/react-datepicker.css";
import "./_app.css";
import SplashScreen from "@component/splash-screen/SplashScreen";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

const App: NextPage = ({ Component, pageProps }: any) => {
  const store = useStore(pageProps.initialReduxState);
  const [lifted, setLifted] = useState(false);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });
  let Layout = Component.layout || Fragment;

  const onBeforeLift = () => {
    setTimeout(() => { 
      setLifted(true);
    }, 3000);
  };

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
          <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
            {!lifted ? (
              <SplashScreen />
            ) : (
              <ErrorBoundary>
                <DispatchInitialProps categories={pageProps.categories}>
                  <Layout>
                    <div style={{ position: "absolute", zIndex: 99999 }}>
                      <ToastContainer align={"right"} position={"bottom"} />
                    </div>
                    <Component {...pageProps} />
                  </Layout>{" "}
                </DispatchInitialProps>
              </ErrorBoundary>
            )}
          </PersistGate>
        </Provider>
      </AppProvider>
    </ThemeProvider>
  );
};

App.getInitialProps = async (appContext: any) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const [categories] = await Promise.all([getCategory()]);

  return {
    ...appProps,
    pageProps: {
      categories: {
        formated: categories.formated,
        clean: categories.clean,
      },
    },
  };
};

export default withAuth(App);
