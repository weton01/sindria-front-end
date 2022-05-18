import LazyImage from "@component/LazyImage";
import productDatabase from "@data/product-database";
import Link from "next/link";
import React from "react";
import Card from "../Card";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import Typography from "../Typography";

export interface Section10Props {
  data: any []
}

const Section10: React.FC<Section10Props> = ({ data }: Section10Props) => {
  return (
    <Container mb="70px">
      <CategorySectionHeader
        title="Categorias"
        iconName="categories"
        seeMoreLink="#"
      />

      <Grid container spacing={6}>
        {data.map((item, ind) => (
          <Grid item lg={2} md={3} sm={4} xs={12} key={ind}>
            <Link href="/">
              <a>
                <Card
                  display="flex"
                  alignItems="center"
                  p="0.75rem"
                  boxShadow="small"
                  borderRadius={8}
                  hoverEffect
                >
                  <LazyImage
                    src={`/assets/images/icons/${item.image}.svg`}
                    alt="fashion"
                    height="52px"
                    width="52px"
                    objectFit="contain"
                    borderRadius={8}
                  />
                  <Typography fontWeight="600" fontSize="14px" ml="10px">
                    {item.name}
                  </Typography>
                </Card>
              </a>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
 

export default Section10;
