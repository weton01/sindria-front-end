import { Chip } from "@component/Chip";
import Image from "@component/Image";
import axios from "axios";
import Link from "next/link";
import React, { Fragment, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROD_URL } from "services/api";
import { CSSProperties } from "styled-components";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import NavLink from "../nav-link/NavLink";
import Rating from "../rating/Rating";
import { H5, SemiSpan } from "../Typography";
import { StyledProductCard9 } from "./ProductCardStyle";

export interface ProductCard9Props {
  className?: string;
  style?: CSSProperties;
  imgUrl?: string;
  title?: string;
  price?: number;
  off?: number;
  rating?: number;
  subcategories?: Array<{
    title: string;
    url: string;
  }>;
  id?: string;
  [key: string]: unknown;
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

const ProductCard9: React.FC<ProductCard9Props> = ({
  imgUrl,
  title,
  price,
  off,
  subcategories,
  rating,
  id,
  ...props
}) => {
  const dispatch = useDispatch();
  const [cartAmount, setCartAmount] = useState(0);
  const [open, setOpen] = useState(false);

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
    <StyledProductCard9 overflow="hidden" width="100%" {...props}>
      <Grid container spacing={1}>
        <Grid item md={3} sm={4} xs={12}>
          <Box position="relative">
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
            <Icon
              color="secondary"
              variant="small"
              className="quick-view"
              onClick={toggleDialog}
            >
              eye-alt
            </Icon>
            <Image
              src={imgUrl}
              alt={title}
              width="100%"
              borderRadius="0.5rem 0px 0px 0.5rem"
            />
          </Box>
        </Grid>

        <Grid item md={8} sm={8} xs={12}>
          <FlexBox
            flexDirection="column"
            justifyContent="center"
            height="100%"
            p="1rem"
          >
            <div className="categories">
              {subcategories?.map((item) => (
                <NavLink className="link" href={item.url} key={item.title}>
                  {item.title}
                </NavLink>
              ))}
            </div>

            <Link href="/product/34324321">
              <a>
                <H5 fontWeight="600" my="0.5rem">
                  {title}
                </H5>
              </a>
            </Link>

            <Rating
              value={rating || 0}
              outof={5}
              color="warn"
              onChange={(value) => {
              }}
            />

            <FlexBox mt="0.5rem" mb="1rem" alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr="0.5rem">
                ${price?.toFixed(2)}
              </H5>
              {off && (
                <SemiSpan fontWeight="600">
                  <del>${(price - (price * off) / 100).toFixed(2)}</del>
                </SemiSpan>
              )}
            </FlexBox>

            <Hidden up="sm">
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row-reverse"
                height="30px"
              >
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

                <FlexBox alignItems="center" flexDirection="row-reverse">
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
                      <H5 fontWeight="600" fontSize="15px" mx="0.75rem">
                        {cartAmount}
                      </H5>
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
                </FlexBox>
              </FlexBox>
            </Hidden>
          </FlexBox>
        </Grid>

        <Hidden as={Grid} down="sm" item md={1} xs={12}>
          <FlexBox
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            minWidth="30px"
            height="100%"
            p="1rem 0rem"
            ml="auto"
          >
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
                  {/* <Icon className="favorite-icon" color="primary" variant="small">
                heart-filled
              </Icon> */}
                </FlexBox>
              ) : null
            }
            {/* <Icon className="favorite-icon" color="primary" variant="small">
              heart-filled
            </Icon> */}

            <FlexBox
              className="add-cart"
              alignItems="center"
              flexDirection={!!!cartAmount ? "column" : "column-reverse"}
            >
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
                  <H5 fontWeight="600" fontSize="15px" m="0.5rem">
                    {cartAmount}
                  </H5>
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
            </FlexBox>
          </FlexBox>
        </Hidden>
      </Grid>

    </StyledProductCard9>
  );
};

ProductCard9.defaultProps = {
  title:
    "Apple iPhone 5 Unlocked 16GB 8MP Used Cell-Phone-16gbIOS Used Refurbished 100%Factory Used",
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

export default ProductCard9;
