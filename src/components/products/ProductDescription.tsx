import React from "react";
import Box from "../Box";
import Typography, { H3 } from "../Typography";

export interface ProductDescriptionProps {
  description: any
}

const ProductDescription: React.FC<ProductDescriptionProps> = (data: ProductDescriptionProps) => {
  return (
    <Box>
      <Typography>
        {data.description}
      </Typography>
    </Box>
  );
};

export default ProductDescription;
