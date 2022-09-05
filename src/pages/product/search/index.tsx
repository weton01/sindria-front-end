import Box from "@component/Box";
import IconButton from "@component/buttons/IconButton";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Hidden from "@component/hidden/Hidden";
import Icon from "@component/icon/Icon";
import NavbarLayout from "@component/layout/NavbarLayout";
import ProductCard1List from "@component/products/ProductCard1List";
import ProductCard9List from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import Select from "@component/Select";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";
import React, { useCallback, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import axios from "axios";
import { PROD_URL } from "services/api";

const ProductSearchResult = ({ query }) => {
  const router = useRouter()

  const [view, setView] = useState("grid");
  const width = useWindowSize();
  const isTablet = width < 1025;

  const routerPush = (query) => (
    router.push({
      path: '/',
      query: query
    })
  )
  const toggleView = useCallback(
    (v) => () => {
      setView(v);
    },
    []
  );

  return (
    <Box pt="20px">
      <FlexBox
        p="1.25rem"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mb="55px"
        elevation={5}
        as={Card}
      >
        <div>
          <H5>Buscando por “ {router?.query?.findBy} ”</H5>
          <Paragraph color="text.muted">{query?.count} Produtos Encontrados</Paragraph>
        </div>
        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Ordenar por:
          </Paragraph>
          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Ordenar Por"
              defaultValue={sortOptions[0]}
              options={sortOptions}
              onChange={(e: any) => {
                routerPush({
                  ...router.query,
                  take: 10,
                  skip: 0,
                  orderBy: e?.value
                })
              }}
            />
          </Box>

          <Paragraph color="text.muted" mr="0.5rem">
            Visualizar:
          </Paragraph>
          <IconButton size="small" onClick={toggleView("grid")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "grid" ? "primary" : "inherit"}
            >
              grid
            </Icon>
          </IconButton>
          <IconButton size="small" onClick={toggleView("list")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "list" ? "primary" : "inherit"}
            >
              menu
            </Icon>
          </IconButton>

          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <IconButton size="small">
                  <Icon>options</Icon>
                </IconButton>
              }
            >
              <ProductFilterCard filter={query?.filter} />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container spacing={6}>
        <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <ProductFilterCard filter={query?.filter} />
        </Hidden>

        <Grid item lg={9} xs={12}>
          {view === "grid" ?
            <ProductCard1List
              items={query.items}
              count={query.count}
              skip={router?.query?.skip}
              take={router?.query?.take}
            /> :
            <ProductCard9List
              items={query.items}
              count={query.count}
              skip={router?.query?.skip}
              take={router?.query?.take}
            />
          }
        </Grid>
      </Grid>
    </Box>
  );
};

const sortOptions = [
  { label: "Relevância", value: "rating=DESC" },
  { label: "Novo", value: "created_at=DESC" },
  { label: "Antigo", value: "created_at=ASC" },
  { label: "Maior Preço", value: "netAmount=DESC" },
  { label: "Menor Preço", value: "netAmount=ASC" },
];

ProductSearchResult.layout = NavbarLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { skip, take, orderBy } = ctx.query;
  const query = ctx.resolvedUrl.split("?")[1].split("&").slice(3).join('&')

  try {
    const { data } = await axios.get(
      `${PROD_URL}product/v1`,
      { params: { skip, take, orderBy, where: query } }
    );

    return {
      props: {
        query: data ? data : {
          filter: {
            brands: [],
            sizes: [],
            tags: []
          },
          count: 0,
          items: []
        },
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
};

export default ProductSearchResult;
