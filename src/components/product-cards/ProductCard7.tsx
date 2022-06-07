import Box from "@component/Box";
import Image from "@component/Image";
import { useAppDispatch } from "@hook/hooks";
import { formatCurrency } from "@utils/formatCurrency";
import Link from "next/link";
import React, { useCallback } from "react";
import { SpaceProps } from "styled-system";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import { StyledProductCard7 } from "./ProductCardStyle";

export interface ProductCard7Props {
  id: string | number;
  name: string;
  qty: number;
  price: number;
  imgUrl?: string;
  item: any;
  mutation: any;
}

const ProductCard7: React.FC<ProductCard7Props & SpaceProps> = ({
  id,
  name,
  qty,
  price,
  imgUrl,
  item,
  mutation,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const onClickRemove = () => {
    dispatch({
      type: "DELETE_FROM_CART",
      payload: item
    });
  }

  const onClickAddCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        quantity: 1,
        netAmount: item?.otherProps?.netAmount,
        grossAmount: item?.otherProps?.grossAmount
      }
    })
  }

  const onClickRemoveFromCart = () => {
    dispatch({
      type: "REMOVE_PRODUCT_FROM_CART",
      payload: {
        ...item,
        netAmount: item?.otherProps?.netAmount,
        grossAmount: item?.otherProps?.grossAmount
      }
    })
  }

  return (
    <StyledProductCard7 {...props}>
      <Image
        src={imgUrl || "/assets/images/products/iphone-xi.png"}
        size={140}
        display="block"
        alt={name}
      />
      <FlexBox
        className="product-details"
        flexDirection="column"
        justifyContent="space-between"
        minWidth="0px"
        width="100%"
      >
        <Link href={`/product/${id? id: ''}`}>
          <a>
            <Typography
              className="title"
              fontWeight="600"
              fontSize="18px"
              mb="0.5rem"
            >
              {name}
            </Typography>
          </a>
        </Link>
        <Box position="absolute" right="1rem" top="1rem">
          <IconButton
            padding="4px"
            ml="12px"
            size="small"
            onClick={onClickRemove}
          >
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        <FlexBox alignItems="center">
          {
            mutation?.variations?.map((item, index) => (
              <Typography key={`typeo-${index}`} color="gray.600" mr="0.5rem">
                {item.type === "size" ? item.size : null}
                {item.type === "default" ? item.name : null}
                {item.type === "color" ? (
                  <Box
                    size={25}
                    width={25}
                    bg="white"
                    display="flex"
                    borderRadius="50%"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid"
                    key={item?.id}
                    padding="3px"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      backgroundColor={item.color}
                      borderRadius="50%"
                    />
                  </Box>
                ) : null}
              </Typography>
            ))
          }
        </FlexBox>

        <FlexBox
          // width="100%"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <FlexBox flexWrap="wrap" alignItems="center">
            <Typography color="gray.600" mr="0.5rem">
              {formatCurrency(price / qty)} x {qty}
            </Typography>
            <Typography fontWeight={600} color="primary.main" mr="1rem">
              {formatCurrency(price)}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="none"
              borderColor="primary.light"
              disabled={qty === 1}
              onClick={onClickRemoveFromCart}
            >
              <Icon variant="small">minus</Icon>
            </Button>
            <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
              {qty}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="none"
              borderColor="primary.light"
              onClick={onClickAddCart}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </StyledProductCard7>
  );
};

export default ProductCard7;
