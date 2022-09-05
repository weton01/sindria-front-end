import FlexBox from "@component/FlexBox";
import LazyImage from "@component/LazyImage";
import Link from "next/link";
import React from "react";
import Box from "../Box";
import Card from "../Card";
import Grid from "../grid/Grid";
import Typography, { H3, Small, Span } from "../Typography";

export interface FashionCard3Props { }

const FashionCard3: React.FC<FashionCard3Props> = () => {
  return (
    <Box flex="1 1 0">
      <Link href="/">
        <a>
          <Card
            p="1rem"
            boxShadow="border"
            borderRadius={4}
            height="100%"
            hoverEffect
          >
            <Grid
              container
              spacing={0}
              flexWrap="wrap-reverse"
              containerHeight="100%"
            >
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box p="1.5rem" height="100%">
                  <Box height="100%" minHeight="190px" position="relative">
                    <FlexBox justifyContent="center" width="100%" alignItems="100%" height="100%"  >
                      <LazyImage
                        src="/assets/images/products/t-shirt-1.png"
                        width={250}
                        height={200}
                        objectFit="contain"
                        alt="model"
                      />
                    </FlexBox>
                  </Box>
                </Box>
              </Grid>

              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box p="1.5rem">
                  <Typography color="text.muted" mb="0.5rem">
                    MEN’S SHOE
                  </Typography>

                  <H3 mb="0.5rem" fontSize="30px" lineHeight="1.3">
                    <Span color="primary.main" fontSize="30px">
                      Stylish
                    </Span>{" "}
                    Genuine Comfy T-shirts
                  </H3>

                  <Typography color="text.muted" mb="1rem">
                    Handcrafted from genuine Italian leather. One inner
                    compartment with black satin lining
                  </Typography>

                  <Small
                    fontWeight="700"
                    borderBottom="2px solid"
                    borderColor="primary.main"
                  >
                    SHOP NOW
                  </Small>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </a>
      </Link>
    </Box >
  );
};

export default FashionCard3;
