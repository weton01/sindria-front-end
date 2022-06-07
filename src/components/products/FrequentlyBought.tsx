import React, { Fragment } from "react";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import ProductCard8 from "../product-cards/ProductCard8";
import { H2, H3, SemiSpan } from "../Typography";
import FrequentlyBoughtWrapper from "./FrequentlyBoughtStyle";

export interface FrequentlyBoughtProps {
  data: any[]
}

const FrequentlyBought: React.FC<FrequentlyBoughtProps> = ({ data }) => {
  return (
    <>
      {data?.length > 0 ?
        <FrequentlyBoughtWrapper mb="3.75rem">
          <H3 mb="24px">Frequently Bought Together</H3>
          <FlexBox className="card-holder" flexWrap="wrap" m="-0.5rem">
            {data.map((item, ind) => (
              <Fragment key={item.id}>
                <ProductCard8
                  m="0.5rem"
                  maxWidth="220px"
                  minWidth="160px"
                  width="100%"
                  flex="1 1 0"
                  id={item.id}
                  price={item.netAmount}
                  imgUrl={item?.freezeProduct?.product?.images[0]}
                  title={item.name}
                />
                {ind < data.length - 1 && (
                  <FlexBox justifyContent="center" alignItems="center">
                    <H2 color="text.muted" mx="0.5rem">
                      +
                    </H2>
                  </FlexBox>
                )}
              </Fragment>
            ))}

            <FlexBox justifyContent="center" alignItems="center">
              <H2 color="text.muted" mx="1.5rem">
                =
              </H2>
            </FlexBox>

            <FlexBox
              className="gray-box"
              border="1px solid"
              borderColor="gray.400"
              m="0.5rem"
              borderRadius={8}
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minWidth={300}
              minHeight={200}
            >
              <H3 color="primary.main">R$2500</H3>
              <SemiSpan mb="1rem">Save R$500</SemiSpan>

              <FlexBox>
                <Button variant="contained" color="primary" size="small" mr="1rem">
                  Adicionar ao Carrinho
                </Button>
           
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </FrequentlyBoughtWrapper> : null
      }

    </>
  );
};

export default FrequentlyBought;
