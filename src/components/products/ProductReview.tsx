import React from "react";
import Box from "../Box";
import ProductComment from "./ProductComment";
import * as yup from "yup";

export interface ProductReviewProps {
  reviews: any[]
  user: any
  productId: string
}

const ProductReview: React.FC<ProductReviewProps> = ({reviews, user }: ProductReviewProps) => {
  return (
    <Box>
      {reviews?.map((item, ind) => ( 
        <ProductComment 
          name={item?.user?.username}
          id={item.id}
          date={item.created_at}
          user={item.user}
          comment={item.description}
          key={ind} 
          rating={item.rating}
          isReview={true}
        />
      ))}
    </Box>
  );
};

export default ProductReview;
