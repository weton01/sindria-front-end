import { useAppDispatch } from "@hook/hooks";
import { PaymentFees } from "@utils/enums/paymentFees";
import React from "react";
import { addToCart } from "store/cartSlice";
import Box from "../Box";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { H3 } from "../Typography";

export interface RelatedProductsProps {
  data: any[]
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  const onClick = (item) => {
    const grossAmount: number = item?.netAmount;
    const fee: number = item?.mutations[0]?.feeTotal
    const total = grossAmount + fee;

    return dispatch(addToCart({ 
        quantity: 1,
        netAmount: total,
        grossAmount: grossAmount,
        product: {
          id: item?.id
        },
        otherProps: {
          ...item,
          mutation: item?.mutations[0],
          title: item.name,
          price: total,
          grossAmount: item?.netAmount,
          netAmount: total,
          user: item.user
        },
        mutation: {
          id: item?.mutations[0]?.id
        }
      }))
  }

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Produtos Relacionados</H3>
      <Grid container spacing={8}>
        {data?.map((item, ind) => {
          const grossAmount: number = item?.netAmount;
          const fee: number = item?.mutations[0]?.feeTotal
          const total = grossAmount + fee;

          return (
            <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
              <ProductCard1
                imgUrl={item.images[0]}
                rating={item.rating}
                off={PaymentFees.credit}
                id={item.id}
                price={(total) + (total * PaymentFees.credit)}
                grossPrice={total}
                title={item.name}
                hoverEffect
                onClickAdd={() => onClick(item)}
              />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
