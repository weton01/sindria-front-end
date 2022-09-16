import { useAppDispatch } from "@hook/hooks";
import { PaymentFees } from "@utils/enums/paymentFees";
import { formatCurrency } from "@utils/formatCurrency";
import React, { Fragment } from "react";
import { addToCart } from "store/cartSlice";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import ProductCard8 from "../product-cards/ProductCard8";
import { H2, H3, SemiSpan } from "../Typography";
import FrequentlyBoughtWrapper from "./FrequentlyBoughtStyle";

export interface FrequentlyBoughtProps {
  data: any[]
}

const calculateTotal = (data): number => {
  let total: number = 0;

  data.forEach((item, ind) => {
    let fee: number = 0;
    let grossAmount: number = item?.product?.netAmount;

    fee += item?.mutation?.feeTotal
    total += grossAmount - (fee * grossAmount)
  })

  return total
}

const FrequentlyBought: React.FC<FrequentlyBoughtProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  const addTocart = (data) => {

    data.forEach((item, ind) => {
      let fee: number = 0;
      let total: number = 0;
      let grossAmount: number = item?.product?.netAmount;

      fee += item?.mutation?.feeTotal

      total = grossAmount + fee;

      return dispatch(addToCart({
       
          quantity: 1,
          netAmount: (total),
          grossAmount: grossAmount,
          product: {
            id: item?.product?.id
          },
          otherProps: {
            ...item,
            ...item.product,
            title: item.product.name,
            price:  (total),
            grossAmount: item?.product?.netAmount,
            netAmount:  (total),
          },
          mutation: {
            id: item.mutation.id
          }
    
      }))
    })
  }


  return (
    <>
      {data?.length > 0 ?
        <FrequentlyBoughtWrapper mb="3.75rem">
          <H3 mb="24px">Frequentemente Comprado Com</H3>
          <FlexBox className="card-holder" flexWrap="wrap" m="-0.5rem">
            {data.map((item, ind) => {
              let fee: number = 0;
              let grossAmount: number = item?.product?.netAmount;

              fee += item?.mutation?.feeTotal

              return (
                <Fragment key={item.id}>
                  <ProductCard8
                    m="0.5rem"
                    maxWidth="220px"
                    minWidth="160px"
                    width="100%"
                    flex="1 1 0"
                    id={item.id}
                    price={grossAmount + fee}
                    imgUrl={item?.freezeProduct?.product?.images[0]}
                    title={item.name}
                    fee={PaymentFees.credit}
                  />
                  {ind < data?.length - 1 && (
                    <FlexBox justifyContent="center" alignItems="center">
                      <H2 color="text.muted" mx="0.5rem">
                        +
                      </H2>
                    </FlexBox>
                  )}
                </Fragment>
              )
            })}

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
              <H3 color="primary.main">{formatCurrency(calculateTotal(data))}</H3>
              <SemiSpan mb="1rem">Economize {formatCurrency(calculateTotal(data) * 0.04)}</SemiSpan>

              <FlexBox>
                <Button onClick={() => {addTocart(data)}} variant="contained" color="primary" size="small" mr="1rem">
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
