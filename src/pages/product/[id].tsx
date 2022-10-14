import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import NavbarLayout from "@component/layout/NavbarLayout";
import FrequentlyBought from "@component/products/FrequentlyBought";
import ProductDescription from "@component/products/ProductDescription";
import ProductIntro from "@component/products/ProductIntro";
import ProductQuestion from "@component/products/ProductQuestion";
import ProductReview from "@component/products/ProductReview";
import RelatedProducts from "@component/products/RelatedProducts";
import { H5 } from "@component/Typography";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { PROD_URL } from "services/api";

const ProductDetails = ({product, reviews, comments, bestSalersRelated, relatedProducts}) => {
  const [selectedOption, setSelectedOption] = useState("description");
  const handleOptionClick = (opt) => () => {
    setSelectedOption(opt);
  };
  
  return (
    <div>
      <ProductIntro 
        {...product}
        title ={ product.name  } 
        price={product.netAmount  }
        mutations={product?.mutations.filter(item => item.stock > 0)}
        variations={product?.variations?.filter(item => item.type === "default")}
        sizes={product?.variations?.filter(item=> item.type === "size")}
        colors={product?.variations?.filter(item=> item.type === "color")}
        otherProps={product}
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
          mr="25px"
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" && "2px solid"}
          borderColor="primary.main"
        >
          Avaliações ({reviews.count})
        </H5>
        <H5
          className="cursor-pointer"
          p="4px 10px"
          color={selectedOption === "questions" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("questions")}
          borderBottom={selectedOption === "questions" && "2px solid"}
          borderColor="primary.main"
        >
          Perguntas ({comments.count})
        </H5>
      </FlexBox>
      <Box mb="50px">
        {selectedOption === "description" && 
          <ProductDescription 
            description={product?.description}
          />
        }
        {selectedOption === "review" && 
          <ProductReview 
            reviews={reviews.items} 
            user={product.user}
            productId={product.id}
          />
        }
        {selectedOption === "questions" && 
          <ProductQuestion 
            comments={comments.items} 
            user={product.user}
            productId={product.id}
          />
        }
      </Box>
      <FrequentlyBought data={relatedProducts}/>
      <RelatedProducts data={bestSalersRelated}/>
    </div>
  );
};

ProductDetails.layout = NavbarLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  try {
    const [ single, comments, reviews ] = await Promise.all([
      axios.get(`${PROD_URL}product/v1/single/${id}`),
      axios.get(`${PROD_URL}comment/v1/${id}?skip=0&take=3`),
      axios.get(`${PROD_URL}review/v1/${id}?skip=0&take=3`),
    ])

    console.log(`deu problema aqui`, single.data.product)
     
    return {
      props: {
        product: single.data?.product,
        bestSalersRelated: single.data.bestSalersRelated,
        relatedProducts: single.data.relatedProducts,
        comments: comments.data,
        reviews: reviews.data
      }
    }

  } catch (err) {
    console.log(`deu erro aqui`, err)
    return {
      redirect: {
        permanent: false,
        destination: "/404"
      }
    }
  }
}


export default ProductDetails;
