import LazyImage from "@component/LazyImage";
import { useAppContext } from "@context/app/AppContext";
import { CartItem } from "@reducer/cartReducer";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { H1, H2, H3, H6, SemiSpan, Small, Tiny } from "../Typography";
import Card from "@component/Card";
import { formatCurrency } from "@utils/formatCurrency";

export interface ProductIntroProps {
  title: string;
  price: number;
  id?: string | number;
  brand: any,
  categories: any[]
  variations: any[]
  images: string[]
  description: string
  tags: any[]
  sizes: any[]
  colors: any[]
}

const ProductIntro: React.FC<ProductIntroProps> = ({
  title,
  price = 200,
  id,
  brand,
  categories,
  variations,
  images,
  description,
  tags,
  sizes,
  colors
}) => {
  const [viewimage, setViewImage] = useState(images[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState(variations[0])
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])

  const cartList: CartItem[] = [];
  const router = useRouter();

  const pixPrice: number = price - (price * 0.01)
  const boletoPrice: number = price - (price * 0.048)
  const creditPrice: number = price - (price * 0)

  return (
    <Box  >
      <Grid container justifyContent="space-between" >
        <Grid item md={6} xs={24} alignItems="center" >
          <Card
            boxShadow="small"
            borderRadius={8}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minWidth={"100%"}
            minHeight={'100%'}
            margin={"20px 10px 60px 0px"}
          >
            <Grid item md={12} xs={12} alignItems="center">
              <Box>
                <FlexBox justifyContent="center" mb="20px">
                  <LazyImage
                    src={viewimage}
                    alt={title}
                    height="450px"
                    width="auto"
                    loading="eager"
                    objectFit="contain"
                    spinning={true}
                  />
                </FlexBox>
                <FlexBox
                  overflow="auto"
                >
                  {images.map((url, ind) => (
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
                      mr={ind === images.length - 1 ? "auto" : "10px"}
                      borderColor={
                        selectedImage === ind ? "primary.main" : "gray.400"
                      }
                      onClick={() => {
                        setSelectedImage(ind)
                        setViewImage(url)
                      }}

                    >
                      <Avatar src={url} borderRadius="5px" size={90} />
                    </Box>
                  ))}
                </FlexBox>
              </Box>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={5.9} xs={24} alignItems="center" >
          <Card
            boxShadow="small"
            display="flex"
            minWidth="100%"
            minHeight='100%'
            margin={"20px 0px 60px 0px"}
            padding={20}
          >
            <Grid md={12} xs={24} item alignItems="center" >
              <FlexBox flexDirection="column" justifyContent="space-between" height="100%">
                <Box>
                  <H1 mb="0.6rem">{title}</H1>
                  <FlexBox alignItems="center" mb="0.6rem" >
                    <FlexBox alignItems="center" gap={10}>
                      <FlexBox alignItems="center" gap={4}>
                        <Box>
                          <Rating color="warn" value={4} outof={5} />
                        </Box>
                        4.0
                      </FlexBox>
                      <FlexBox alignItems="center" gap={4}>
                        (50)
                        Avaliações
                      </FlexBox>
                      <FlexBox alignItems="center" gap={4}>
                        <Box>
                          {1405}
                        </Box>
                        pedidos
                      </FlexBox>
                    </FlexBox>
                  </FlexBox>

                  <FlexBox alignItems="center" mb="0.7rem" gap={4}>
                    <H6 >{brand.name}</H6>
                    <Icon size="20px" defaultcolor="currentColor">
                      {brand.image}
                    </Icon>
                  </FlexBox>

                  <FlexBox justifyContent="flex-start" alignItems="center" mb="0.8rem" gap={4}>
                    {categories.map(item => (
                      item.image ?
                        <Box
                          key={item.id}
                          backgroundColor="rgb(239, 239, 239)"
                          padding="0 7px"
                          fontSize={15}
                          borderRadius={2}
                          color="#000000d9"
                        >
                          <FlexBox justifyContent="flex-start" alignItems="center" gap={4}>
                            <Icon size="20px" defaultcolor="currentColor">
                              {item.image}
                            </Icon>
                            {item.name}
                          </FlexBox>
                        </Box>
                        : null
                    ))
                    }
                  </FlexBox>

                  <FlexBox justifyContent="flex-start" alignItems="center" mb="0.8rem" gap={4}>
                    {tags.map(item => (
                      <Box
                        key={item.id}
                        backgroundColor="rgb(239, 239, 239)"
                        padding="0 7px"
                        fontSize={13}
                        borderRadius={2}
                        color="#000000d9"
                      >
                        {item.name}
                      </Box>
                    ))}
                  </FlexBox>

                  <FlexBox
                    mb="0.8rem"
                    minHeight={70}
                    bg="primary.main"
                    borderRadius={4}
                    padding="0 8px"
                    width="100%"
                    alignItems="center"
                  >
                    <FlexBox justifyContent="space-between" width="100%" flexWrap="wrap">

                      <FlexBox flexDirection="column" gap={2} minWidth={125}>
                        <SemiSpan color="white">
                          Boleto
                        </SemiSpan>
                        <H2 color="white" lineHeight="1">
                          {formatCurrency(boletoPrice)}
                        </H2>
                        <Small color="white">
                          4.8% de desconto
                        </Small>
                      </FlexBox>

                      <FlexBox flexDirection="column" gap={2} minWidth={125}>
                        <SemiSpan color="white">
                          Pix
                        </SemiSpan>
                        <H2 color="white" lineHeight="1">
                          {formatCurrency(pixPrice)}
                        </H2>
                        <Small color="white">
                          3.6% de desconto
                        </Small>
                      </FlexBox>

                      <FlexBox gap={4}>
                        <FlexBox flexDirection="column" gap={2} minWidth={125}>
                          <SemiSpan color="white">
                            Crédito
                          </SemiSpan>
                          <H2 color="white" lineHeight="1">
                            {formatCurrency(creditPrice)}
                          </H2>
                          <Small color="white">
                            Sem desconto
                          </Small>
                        </FlexBox>
                      </FlexBox>
                    </FlexBox>

                  </FlexBox>

                  {
                    colors.length > 0 ?
                      <FlexBox
                        overflow="auto"
                        justifyContent="flex-start"
                        mb="1rem"
                        gap={8}
                      >
                        {colors.map((item, ind) => (
                          <Box
                            size={35}
                            width={35}
                            bg="white"
                            display="flex"
                            borderRadius="50%"
                            justifyContent="center"
                            alignItems="center"
                            cursor="pointer"
                            border="1px solid"
                            key={item.id}
                            padding="3px"

                            mr={ind === images.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedColor?.id === item.id ? "primary.main" : "gray.400"
                            }
                            onClick={() => {
                              setSelectedColor(item)
                            }}
                          >
                            <Box
                              width="100%"
                              height="100%"
                              backgroundColor={item.color}
                              borderRadius="50%"
                            />
                          </Box>
                        ))}
                      </FlexBox>
                      : null
                  }

                  {
                    sizes.length > 0 ?
                      <FlexBox
                        overflow="auto"
                        justifyContent="flex-start"
                        mb="1rem"
                        gap={8}
                      >
                        {sizes.map((item, ind) => (
                          <Box
                            size={35}
                            width={35}
                            bg="white"
                            display="flex"
                            borderRadius="5px"
                            justifyContent="center"
                            alignItems="center"
                            cursor="pointer"
                            border="1px solid"
                            key={item.id}
                            mr={ind === images.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedSize?.id === item.id ? "primary.main" : "gray.400"
                            }
                            onClick={() => {
                              setSelectedSize(item)
                            }}
                          >
                            {item.size}
                          </Box>
                        ))}
                      </FlexBox>
                      : null
                  }

                  {
                    variations.length > 0 ?
                      <FlexBox
                        overflow="auto"
                        justifyContent="flex-start"
                        mb="1rem"
                      >
                        {variations.map((item, ind) => (
                          <Box
                            size={70}
                            width={70}
                            bg="white"
                            borderRadius="5px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            cursor="pointer"
                            border="1px solid"
                            key={item.id}
                            mr={ind === images.length - 1 ? "10px" : "10px"}
                            borderColor={
                              selectedType?.id === item.id ? "primary.main" : "gray.400"
                            }
                            onClick={() => {
                              setSelectedType(item)
                              setViewImage(item.image)
                            }}
                          >
                            <Avatar src={item.image} borderRadius="5px" size={60} />
                          </Box>
                        ))}
                      </FlexBox>
                      : null
                  }
                </Box>
                <Box>
                  <FlexBox gap={8} >
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      mb="16px"
                      width="60%"
                      height="46px"
                    >
                      Adicionar no carrinho
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      mb="16px"
                      height="46px"
                    >
                      <Icon size="20px" defaultcolor="currentColor" mr="8px" >
                        heart
                      </Icon>
                      1233
                    </Button>
                  </FlexBox>

                  <FlexBox mb="16px" justifyContent="flex-start" alignItems="center">
                    <Icon size="40px">
                      shield
                    </Icon>
                    <FlexBox paddingLeft="4px" flexDirection="column">
                      <Small>
                        <strong>
                          Proteção ao Consumidor de 75 Dias
                        </strong>
                      </Small>
                      <Tiny>
                        Garantia de reembolso
                      </Tiny>
                    </FlexBox>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
