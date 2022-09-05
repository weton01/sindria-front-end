import Card from "@component/Card";
import React from "react";
import CategorySectionCreator from "../CategorySectionCreator";
import Grid from "../grid/Grid";
import ProductCard2 from "../product-cards/ProductCard2";

export interface Section5Props {
  data: {
    items: any[],
    count: number
  }
}

const Section5: React.FC<Section5Props> = ({ data }: Section5Props) => {
  return (
    <CategorySectionCreator
      iconName="new-product-1"
      title="Novas chegadas"
      seeMoreLink="#"
    >
      <Card p="1rem">
        <Grid container spacing={6}>
          {data?.items?.map((item) => (
            <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
              <ProductCard2
                imgUrl={item.images[0]}
                price={item.netAmount}
                productUrl={`/product/${item.id}`}
                title={item.name}
              />
            </Grid>
          ))}
        </Grid>
      </Card>
    </CategorySectionCreator>
  );
};

export default Section5;
