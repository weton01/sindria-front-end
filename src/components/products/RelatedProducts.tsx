import React from "react";
import Box from "../Box";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { H3 } from "../Typography";

export interface RelatedProductsProps {
  data: any[]
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ data }) => {
  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Realted Products</H3>
      <Grid container spacing={8}>
        {data.map((item, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              imgUrl={item.images[0]}
              rating={item.rating}
              off={0.4}
              id={item.id}
              price={item.netAmount}
              title={item.name}
              hoverEffect />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
