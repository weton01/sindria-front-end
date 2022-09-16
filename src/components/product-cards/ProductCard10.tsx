import LazyImage from "@component/LazyImage";
import axios from "axios";
import Link from "next/link";
import React, { Fragment, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROD_URL } from "services/api";
import { matchProduct } from "store/matchSlice";
import { CSSProperties } from "styled-components";
import Box from "../Box";
import Button from "../buttons/Button";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import { H3, SemiSpan } from "../Typography";
import { StyledProductCard1 } from "./ProductCardStyle";

export interface ProductCard10Props {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  id?: string;
  rating?: number;
  subcategories?: Array<{
    title: string;
    url: string;
  }>;
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

const ProductCard10: React.FC<ProductCard10Props> = ({
  imgUrl,
  title,
  price,
  off,
  subcategories,
  rating,
  id,
  ...props
}) => {
  const [cartAmount, setCartAmount] = useState(0);
  const [open, setOpen] = useState(false);

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

    dispatch(matchProduct(id));
  }

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleCartAmountChange = useCallback(
    (amount) => () => {

      if (amount >= 0) setCartAmount(amount);
    },
    []
  );

  return (
    <StyledProductCard1 {...props}>
      <div className="image-holder">
        {off && (
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

        <FlexBox className="extra-icons">
          <Icon
            color="secondary"
            variant="small"
            mb="0.5rem"
            onClick={toggleDialog}
          >
            eye-alt
          </Icon>


          {
            user.isLogged ? (
              <FlexBox className="extra-icons">
                <Icon
                  onClick={onMatch}
                  color={foundProduct ? 'primary' : 'secondary'}
                  className={`favorite-icon`}
                  variant="small"
                >
                  {foundProduct ? 'heart-filled' : 'heart'}
                </Icon>
              </FlexBox>
            ) : null
          }
        </FlexBox>

        <Link href="/product/34324321">
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
            <Link href="/product/34324321">
              <a>
                <H3
                  className="title"
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  color="text.secondary"
                  mb="6px"
                  title={title}
                >
                  {title}
                </H3>
              </a>
            </Link>

            <SemiSpan>300ml</SemiSpan>

            <FlexBox alignItems="center" mt="6px">
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                ${price?.toFixed(2)}
              </SemiSpan>
              {off && (
                <SemiSpan color="text.muted" fontWeight="600">
                  <del>${(price - (price * off) / 100).toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>
          </Box>

          <FlexBox
            flexDirection="column-reverse"
            alignItems="center"
            justifyContent={!!cartAmount ? "space-between" : "flex-start"}
            width="30px"
          >
            {/* <div className="add-cart"> */}
            <Button
              variant="outlined"
              color="primary"
              padding="5px"
              size="none"
              borderColor="primary.light"
              onClick={handleCartAmountChange(cartAmount + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>

            {!!cartAmount && (
              <Fragment>
                <SemiSpan color="text.primary" fontWeight="600">
                  {cartAmount}
                </SemiSpan>
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="none"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(cartAmount - 1)}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </Fragment>
            )}
            {/* </div> */}
          </FlexBox>
        </FlexBox>
      </div>
    </StyledProductCard1>
  );
};

ProductCard10.defaultProps = {
  // title: "KSUS ROG Strix G15",
  title: "KSUS ROG Strix G15 ASUS ROG Strix G15 ASUS ROG Strix G15",
  imgUrl: "/assets/images/products/macbook.png",
  off: 50,
  price: 450,
  rating: 0,
  subcategories: [
    {
      title: "Bike",
      url: "/#",
    },
    {
      title: "Ducati",
      url: "/#",
    },
    {
      title: "Motors",
      url: "/#",
    },
  ],
};

export default ProductCard10;
