import productDatabase from "@data/product-database";
import { useRouter } from "next/router";
import React from "react";
import FlexBox from "../FlexBox";
import Pagination from "../pagination/Pagination";
import ProductCard9 from "../product-cards/ProductCard9";
import { SemiSpan } from "../Typography";

export interface ProductCard9ListProps {
  items: any[];
  count: any;
  take: any;
  skip: any;
}

const ProductCard9List: React.FC<ProductCard9ListProps> = ({ items, count, skip, take }) => {
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
    <div>
      {items.map((item, ind) => (
        <ProductCard9 mb="1.25rem" key={ind}
          id={item.id}
          imgUrl={item.images[0]}
          price={item.netAmount}
          rating={item.rating}
          title={item.name}
          grossPrice={item.grossAmount}
        />
      ))}

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt="32px"
      >
         <SemiSpan>Mostrando {skip === '0' ? 1 : skip}-{take} de {count} produtos</SemiSpan>
        <Pagination pageCount={count / take} onChange={onPaginationChange} />
      </FlexBox>
    </div>
  );
};

export default ProductCard9List;
