import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import NavbarLayout from "@component/layout/NavbarLayout";
import AvailableShops from "@component/products/AvailableShops";
import FrequentlyBought from "@component/products/FrequentlyBought";
import ProductDescription from "@component/products/ProductDescription";
import ProductIntro from "@component/products/ProductIntro";
import ProductReview from "@component/products/ProductReview";
import RelatedProducts from "@component/products/RelatedProducts";
import { H5 } from "@component/Typography";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { get, PROD_URL } from "services/api";

const ProductDetails = ({product}) => {
  const state = {
    title: "Mi Note 11 Pro",
    price: 1135,
  };

  const [selectedOption, setSelectedOption] = useState("description");

  const handleOptionClick = (opt) => () => {
    setSelectedOption(opt);
  };

  return (
    <div>
      <ProductIntro 
        title ={ product.name } 
        price={product.netAmount}
        brand={product.brand}
        categories={product.categories}
        variations={product.variations.filter(item => item.type === "default")}
        sizes={product.variations.filter(item=> item.type === "size")}
        colors={product.variations.filter(item=> item.type === "color")}
        images={product.images}
        description={product.description}
        tags={product.tags}
      />
      <FlexBox
        borderBottom="1px solid"
        borderColor="gray.400"
        mb="26px"
        mt="50px"
      >
        <H5
          className="cursor-pointer"
          mr="25px"
          p="4px 10px"
          color={
            selectedOption === "description" ? "primary.main" : "text.muted"
          }
          borderBottom={selectedOption === "description" && "2px solid"}
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
        >
          Descrição
        </H5>
        <H5
          className="cursor-pointer"
          p="4px 10px"
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" && "2px solid"}
          borderColor="primary.main"
        >
          Avaliações (3)
        </H5>
        <H5
          className="cursor-pointer"
          p="4px 10px"
          color={selectedOption === "questions" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("questions")}
          borderBottom={selectedOption === "questions" && "2px solid"}
          borderColor="primary.main"
        >
          Perguntas (3)
        </H5>
      </FlexBox>
      <Box mb="50px">
        {selectedOption === "description" && <ProductDescription description={product?.description}/>}
        {selectedOption === "review" && <ProductReview />}
        {selectedOption === "questions" && <ProductReview />}
      </Box>
      <FrequentlyBought />
      <AvailableShops />
      <RelatedProducts />
    </div>
  );
};

ProductDetails.layout = NavbarLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  try {
    const {data} = await axios.get(`${PROD_URL}product/v1/single/${id}`)

    return {
      props: {
        product: data
      }
    }

  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/404"
      }
    }
  }
}


export default ProductDetails;
