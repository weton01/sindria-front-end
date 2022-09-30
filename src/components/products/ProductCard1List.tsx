import productDatabase from "@data/product-database";
import { useRouter } from "next/router";
import React from "react";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Pagination from "../pagination/Pagination";
import ProductCard1 from "../product-cards/ProductCard1";
import { SemiSpan } from "../Typography";

export interface ProductCard1ListProps {
  items: any[];
  count: any;
  take: any;
  skip: any;
}

const ProductCard1List: React.FC<ProductCard1ListProps> = ({ items, count, skip, take }) => {
  const router = useRouter()

  const routerPush = (query) => (
    router.push({
      path: '/',
      query: query
    })
  )


  const onPaginationChange = (e) => {
    routerPush({
      ...router.query,
      take: 10,
      skip: e,
    })
  }

  return (
    <>
      <Grid container spacing={6}>
        {items?.map((item, ind) => (
          <Grid item lg={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              id={item.id}
              imgUrl={item.images[0]}
              price={item.netAmount}
              rating={item.rating}
              title={item.name}
              grossPrice={item.grossAmount}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt="32px"
      >
        <SemiSpan>Mostrando {skip === '0' ? 1 : skip}-{take} de {count} produtos</SemiSpan>
        <Pagination pageCount={count / take} onChange={onPaginationChange} />
      </FlexBox>
    </>
  );
};

export default ProductCard1List;
