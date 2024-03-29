import LazyImage from "@component/LazyImage";
import { formatCurrency } from "@utils/formatCurrency";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { PROD_URL } from "services/api";
import { CSSProperties } from "styled-components";
import Box from "../Box";
import Button from "../buttons/Button";
import { CardProps } from "../Card";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { H3, SemiSpan } from "../Typography";
import { StyledProductCard1 } from "./ProductCardStyle";
import { useDispatch, useSelector } from "react-redux";

export interface ProductCard1Props extends CardProps {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  rating?: number;
  id?: string | number;
  grossPrice?: number;
  onClickAdd?: any;
  // className?: string;
  // style?: CSSProperties;
  // imgUrl: string;
  // title: string;
  // price: number;
  // off: number;
  // rating?: number;
  // subcategories?: Array<{
  //   title: string;
  //   url: string;
  // }>;
}

const ProductCard1: React.FC<ProductCard1Props> = ({
  id,
  imgUrl,
  title,
  price,
  off,
  rating,
  grossPrice,
  onClickAdd,
  ...props
}) => {
  const dispatch = useDispatch();

  const user = useSelector((selec: any) =>
    selec?.user
  );

  const favorites = useSelector((selec: any) =>
    selec?.favorites?.matches
  );

  const foundProduct = favorites.find(item => item.id === id)
 
  const onMatch = () => {
    axios.post(`${PROD_URL}product/v1/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    dispatch({
      type: "MATCH_PRODUCT",
      payload: id
    });

  }

  return (
    <StyledProductCard1 {...props}>
      <div className="image-holder">
        {!!off && (
          <Chip
            position="absolute"
            bg="primary.main"
            color="primary.text"
            fontSize="10px"
            fontWeight="600"
            p="5px 10px"
            top="10px"
            left="10px"
          >
            {off}% off
          </Chip>
        )}

        {
          user.isLogged ? (
            <FlexBox className="extra-icons">
              <Icon 
                onClick={onMatch} 
                color={foundProduct? 'primary': 'secondary'} 
                className={`favorite-icon`} 
                variant="small"
              >
                {foundProduct ? 'heart-filled' : 'heart'}
              </Icon>
              {/* <Icon className="favorite-icon" color="primary" variant="small">
                heart-filled
              </Icon> */}
            </FlexBox>
          ) : null
        }

        <Link href={`/product/${id}`}>
          <a>
            <LazyImage
              src={imgUrl}
              width="100%"
              height="100%"
              layout="responsive"
              alt={title}
            />
          </a>
        </Link>
      </div>
      <div className="details">
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
            <Link href={`/product/${id}`}>
              <a>
                <H3
                  className="title"
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  color="text.secondary"
                  mb="10px"
                  title={title}
                >
                  {title}
                </H3>
              </a>
            </Link>

            <Rating value={rating || 0} outof={5} color="warn" readonly />

            <FlexBox alignItems="center" mt="10px">
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                {formatCurrency(grossPrice)}
              </SemiSpan>
              {off && (
                <SemiSpan color="text.muted" fontWeight="600">
                  <del>{formatCurrency(price)}</del>
                </SemiSpan>
              )}
            </FlexBox>
          </Box>

        </FlexBox>
      </div>
    </StyledProductCard1>
  );
};

ProductCard1.defaultProps = {
  id: "324321",
  title: "KSUS ROG Strix G15",
  imgUrl: "/assets/images/products/macbook.png",
  off: 50,
  price: 450,
  rating: 0,
};

export default ProductCard1;
