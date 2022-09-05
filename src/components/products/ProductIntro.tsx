import LazyImage from "@component/LazyImage";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import Typography, { H1, H2, H6, SemiSpan, Small, Tiny } from "../Typography";
import Card from "@component/Card";
import { formatCurrency } from "@utils/formatCurrency";
import { useAppDispatch } from "@hook/hooks";
import { useSelector } from "react-redux";
import axios from "axios";
import { PROD_URL } from "services/api";
import TextField from "@component/text-field/TextField";

export interface ProductIntroProps {
  title: string;
  price: number;
  id?: string | number;
  brand: any;
  categories: any[];
  variations: any[];
  images: string[];
  tags: any[];
  sizes: any[];
  colors: any[];
  salesQuantity: number;
  reviewsQuantity: number;
  rating: number;
  mutations: any[];
  otherProps: any;
}

const ProductIntro: React.FC<ProductIntroProps> = ({
  title,
  price = 200,
  id,
  brand,
  categories,
  variations,
  images,
  tags,
  sizes,
  colors,
  salesQuantity,
  reviewsQuantity,
  rating,
  mutations,
  otherProps,
}) => {
  const dispatch = useAppDispatch();

  const defaultSize =
    mutations?.length > 0
      ? mutations[0]?.variations?.find((v) => v?.type === "size")
      : {};
  const defaultColor =
    mutations?.length > 0
      ? mutations[0]?.variations?.find((v) => v?.type === "color")
      : {};
  const defaultVariation =
    mutations?.length > 0
      ? mutations[0]?.variations?.find((v) => v?.type === "default")
      : {};

  const [viewimage, setViewImage] = useState(images[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState(defaultSize);
  const [selectedSize, setSelectedSize] = useState(defaultColor);
  const [selectedColor, setSelectedColor] = useState(defaultVariation);
  const [selectedMutations, setSelectedMutations] = useState(mutations);
  const [selectedPrice, setSelectedPrice] = useState(price);
  const [selectQuantity, setSelectQuantity] = useState(1);

  const findShirtColorProductExists = (iparam): boolean => {
    return selectedMutations.find((item) => {
      const foundColor = item?.variations?.find((v) => v.id === iparam?.id);
      const foundSize = item?.variations?.find(
        (v) => v.id === selectedSize?.id
      );

      return foundColor && foundSize;
    })
      ? true
      : false;
  };

  const findShirtSizeProductExists = (iparam): boolean => {
    return mutations.find((item) => {
      const foundSize = item?.variations?.find((v) => v.id === iparam?.id);

      return foundSize;
    })
      ? true
      : false;
  };

  const findOtherSizeProductExists = (iparam): boolean => {
    return selectedMutations.find((item) => {
      const foundSize = item?.variations?.find((v) => v.id === iparam?.id);

      return foundSize;
    })
      ? true
      : false;
  };

  const filterMutations = (iparam: any) => {
    const selected = mutations.filter((item) => {
      const foundSize = item?.variations?.find((v) => v.id === iparam.id);

      return foundSize;
    });

    setSelectedMutations([...selected]);
  };

  const findMutation = () => {
    const mutation = mutations.find((item) => {
      const foundSize = item?.variations?.find(
        (v) => v.id === selectedSize?.id
      );
      const foundColor = item?.variations?.find(
        (v) => v.id === selectedColor?.id
      );
      const foundType = item?.variations?.find(
        (v) => v.id === selectedType?.id
      );

      if (variations?.length > 0) return foundSize && foundType;
      else return foundColor && foundSize;
    });
    return mutation;
  };

  const getPrice = () => {
    const mutation = findMutation();

    return price + mutation?.feeTotal;
  };

  const addItemToCart = () => {
    const mutation = findMutation();

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        quantity: selectQuantity,
        netAmount: getPrice(),
        grossAmount: price,
        product: {
          id: id,
        },
        otherProps: {
          ...otherProps,
          title,
          price,
          brand,
          id,
          categories,
          images,
          tags,
          mutation: mutation,
          grossAmount: price,
          netAmount: getPrice(),
        },
        mutation: {
          id: mutation.id,
        },
      },
    });
  };

  useEffect(() => {
    setSelectedMutations(mutations);
  }, [mutations]);

  useEffect(() => {
    // setSelectedType(defaultVariation);
    setSelectedSize(defaultSize);
    setSelectedColor(defaultColor);
  }, [defaultSize, defaultColor, defaultVariation]);

  useEffect(() => {
    const size = selectedMutations[0]?.variations?.find(
      (v) => v?.type === "size"
    );
    const color = selectedMutations[0]?.variations?.find(
      (v) => v?.type === "color"
    );
    const type = selectedMutations[0]?.variations?.find(
      (v) => v?.type === "default"
    );

    // setSelectedType(type);
    setSelectedSize(size);
    setSelectedColor(color);
  }, [selectedMutations]);

  useEffect(() => {
    const price = getPrice();

    setSelectedPrice(price);
  }, [selectedSize, selectedColor, selectedType]);

  const user = useSelector((selec: any) => selec?.user);

  const favorites = useSelector((selec: any) => selec?.favorites?.matches);

  const foundProduct = favorites.find((item) => item.id === id);

  const onMatch = () => {
    axios.post(
      `${PROD_URL}product/v1/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    dispatch({
      type: "MATCH_PRODUCT",
      payload: id,
    });
  };


  return (
    <Card
      boxShadow="small"
      borderRadius={8}
      width="100%"
      overflow="hidden"
      p={16}
    >
      <Box>
        <Grid container justifyContent="space-between" spacing={5}>
          <Grid item md={5} xs={24} alignItems="center">
            <Box height={"100%"} width="100%">
              <FlexBox
                position="relative"
                minWidth={150}
                height="26rem"
                width={"100%"}
                mb="20px"
              >
                <LazyImage src={viewimage} alt={title} layout="fill" />
              </FlexBox>
              <FlexBox overflow="auto">
                {images?.map((url, ind) => (
                  <Box
                    size={100}
                    width={100}
                    bg="white"
                    borderRadius="5px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                    border="1px solid"
                    key={ind}
                    ml={ind === 0 && "auto"}
                    mr={ind === images?.length - 1 ? "auto" : "10px"}
                    borderColor={
                      selectedImage === ind ? "primary.main" : "gray.400"
                    }
                    onClick={() => {
                      setSelectedImage(ind);
                      setViewImage(url);
                    }}
                  >
                    <Avatar src={url} borderRadius="5px" size={90} />
                  </Box>
                ))}
              </FlexBox>
            </Box>
          </Grid>
          <Grid item md={7} xs={24} alignItems="center">
            <Grid md={12} xs={24} item alignItems="center">
              <FlexBox
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
                gap={12}
              >
                <Box>
                  <H1 mb="0.6rem">{title}</H1>
                  <FlexBox alignItems="center" mb="0.6rem">
                    <FlexBox alignItems="center" gap={10}>
                      <FlexBox alignItems="center" gap={4}>
                        <Box>
                          <Rating color="warn" value={rating} outof={5} />
                        </Box>
                        {rating?.toFixed(1)}
                      </FlexBox>
                      <FlexBox alignItems="center" gap={4}>
                        ({reviewsQuantity}) Avaliações
                      </FlexBox>
                      <FlexBox alignItems="center" gap={4}>
                        <Box>{salesQuantity}</Box>
                        pedidos
                      </FlexBox>
                    </FlexBox>
                  </FlexBox>

                  <FlexBox
                    padding="15px 20px"
                    mt="2rem"
                    bg="#fafafa"
                    alignItems="center"
                    gap={12}
                  >
                    <Typography fontWeight={"600"}>
                      <del>
                        {formatCurrency(selectedPrice + selectedPrice * 0.1)}
                      </del>
                    </Typography>
                    <H1 color="primary.main" lineHeight="1">
                      {formatCurrency(selectedPrice)}
                      <Small>/ UN</Small>
                    </H1>
                    <Typography
                      fontSize={11}
                      fontWeight={"600"}
                      borderRadius={1}
                      bg="primary.main"
                      pr="0.5rem"
                      p={"2px"}
                      color="white"
                      mt={"5px"}
                    >
                      10% OFF
                    </Typography>
                  </FlexBox>
                </Box>
                <Box>
                  {colors?.length > 0 ? (
                    <FlexBox
                      overflow="auto"
                      justifyContent="flex-start"
                      alignItems="center"
                      mb="1rem"
                      gap={8}
                    >
                      <Typography width="80px">Cores:</Typography>
                      {colors.map((item, ind) => {
                        const foundVariation =
                          findShirtColorProductExists(item);
                        return (
                          <Box
                            size={35}
                            width={35}
                            bg="white"
                            display="flex"
                            borderRadius="50%"
                            justifyContent="center"
                            alignItems="center"
                            cursor={foundVariation ? "pointer" : "not-allowed"}
                            border="1px solid"
                            key={item?.id}
                            padding="3px"
                            mr={ind === images?.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedColor?.id === item?.id
                                ? "primary.main"
                                : "gray.400"
                            }
                            onClick={() => {
                              if (foundVariation) {
                                setSelectedColor(item);
                              }
                            }}
                          >
                            <Box
                              width="100%"
                              height="100%"
                              opacity={foundVariation ? 1 : 0.5}
                              backgroundColor={item.color}
                              borderRadius="50%"
                            />
                          </Box>
                        );
                      })}
                    </FlexBox>
                  ) : null}

                  {sizes?.length > 0 ? (
                    <FlexBox
                      overflow="auto"
                      justifyContent="flex-start"
                      alignItems="center"
                      mb="1rem"
                      gap={8}
                    >
                      <Typography width="80px">Tamanhos:</Typography>
                      {sizes.map((item, ind) => {
                        const foundVariation =
                          variations?.length === 0
                            ? findShirtSizeProductExists(item)
                            : findOtherSizeProductExists(item);
                        return (
                          <Box
                            size={35}
                            width={35}
                            bg="white"
                            display="flex"
                            borderRadius="5px"
                            justifyContent="center"
                            alignItems="center"
                            opacity={foundVariation ? 1 : 0.5}
                            cursor={foundVariation ? "pointer" : "not-allowed"}
                            border="1px solid"
                            key={item?.id}
                            mr={ind === images?.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedSize?.id === item?.id
                                ? "primary.main"
                                : "gray.400"
                            }
                            onClick={() => {
                              if (foundVariation) {
                                setSelectedSize(item);
                                if (variations?.length === 0)
                                  filterMutations(item);
                              }
                            }}
                          >
                            {item.size}
                          </Box>
                        );
                      })}
                    </FlexBox>
                  ) : null}

                  {variations?.length > 0 ? (
                    <FlexBox
                      overflow="auto"
                      justifyContent="flex-start"
                      alignItems="center"
                      mb="1rem"
                    >
                      <Typography >Variações:</Typography>
                      {variations?.map((item, ind) => {
                        let foundVariation = false;
                        mutations.forEach((m) => {
                          const ids = m.variations?.map((v) => v?.id);
                          if (ids.includes(item?.id)) foundVariation = true;
                        });
                        return (
                          <Box
                            size={70}
                            width={70}
                            bg="white"
                            borderRadius="5px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            opacity={foundVariation ? 1 : 0.5}
                            cursor={foundVariation ? "pointer" : "not-allowed"}
                            border="1px solid"
                            key={item?.id}
                            mr={ind === images?.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedType?.id === item?.id
                                ? "primary.main"
                                : "gray.400"
                            }
                            onClick={() => {
                              if (foundVariation) {
                                setSelectedType(item);
                                filterMutations(item);
                              }
                            }}
                          >
                            <Avatar
                              src={item.image}
                              borderRadius="5px"
                              size={60}
                            />
                          </Box>
                        );
                      })}
                    </FlexBox>
                  ) : null}
                </Box>
                <Box>
                  <FlexBox mb={12}>
                    <Button
                      variant="outlined"
                      style={{ borderRadius: 0, borderRight: "none" }}
                      disabled={selectQuantity <= 1}
                      onClick={() => {
                        setSelectQuantity(selectQuantity - 1);
                      }}
                      size="small"
                    >
                      -
                    </Button>
                    <TextField
                      name={`name`}
                      placeholder="Soluções Ltda..."
                      style={{
                        borderRadius: 0,
                        width: 75,
                        textAlign: "center",
                      }}
                      disabled={true}
                      value={selectQuantity}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      style={{ borderRadius: 0, borderLeft: "none" }}
                      onClick={() => {
                        setSelectQuantity(selectQuantity + 1);
                      }}
                    >
                      +
                    </Button>
                  </FlexBox>
                  <FlexBox gap={8}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      mb="16px"
                      width={325}
                      height="46px"
                      onClick={addItemToCart}
                    >
                      Adicionar no carrinho
                    </Button>
                    <Button
                      variant={"outlined"}
                      size="small"
                      color="primary"
                      mb="12px"
                      height="46px"
                      onClick={onMatch}
                    >
                      <Icon
                        onClick={onMatch}
                        color={foundProduct ? "primary" : "secondary"}
                        className={`favorite-icon`}
                        variant="small"
                        mr={"8px"}
                      >
                        {foundProduct ? "heart-filled" : "heart"}
                      </Icon>
                      1233
                    </Button>
                  </FlexBox>
                  <FlexBox gap={4}></FlexBox>
                  <FlexBox
                    mb="16px"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Icon size="40px">shield</Icon>
                    <FlexBox paddingLeft="4px" flexDirection="column">
                      <Small>
                        <strong>Proteção ao Consumidor de 75 Dias</strong>
                      </Small>
                      <Tiny>Garantia de reembolso</Tiny>
                    </FlexBox>
                  </FlexBox>
                  <FlexBox
                    mt={"1rem"}
                    mb={"1rem"}
                    justifyContent="center"
                    flexDirection="column"
                    gap={2}
                    minWidth={125}
                  >
                    <Typography fontWeight={"600"} lineHeight={1} color="white">
                      <FlexBox gap={12} alignItems="center">
                        <FlexBox color="gray.900" gap={4} alignItems="center">
                          <Icon size="18px">pix</Icon>Pix
                        </FlexBox>
                        <FlexBox color="gray.900" gap={4} alignItems="center">
                          <Icon size="18px">credit</Icon>Crédito
                        </FlexBox>
                        <FlexBox color="gray.900" gap={4} alignItems="center">
                          <Icon size="18px">boleto</Icon>Boleto
                        </FlexBox>
                      </FlexBox>
                    </Typography>
                  </FlexBox>
                  <FlexBox alignItems="center" mb="1rem">
                    <SemiSpan>Sold By:</SemiSpan>
                    <Link href="/shop/fdfdsa">
                      <a>
                        <H6 lineHeight="1" ml="8px">
                          Mobile Store
                        </H6>
                      </a>
                    </Link>
                  </FlexBox>
                </Box>
              </FlexBox>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default ProductIntro;
