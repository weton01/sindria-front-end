import HoverBox from "@component/HoverBox";
import LazyImage from "@component/LazyImage";
import { H4 } from "@component/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import Link from "next/link";
import React from "react";

export interface ProductCard2Props {
  imgUrl: string;
  title: string;
  price: number;
  productUrl: string;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
  imgUrl,
  title,
  price,
  productUrl,
}) => {
  
  return (
    <Link href={productUrl}>
      <a>
        <HoverBox borderRadius={8} mb="0.5rem">
          <LazyImage
            src={imgUrl}
            width="100%"
            height="100%"
            layout="responsive"
            alt={title}
          />
        </HoverBox>
        <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
          {title}
        </H4>
        <H4 fontWeight="600" fontSize="14px" color="primary.main">
          {formatCurrency(Math.ceil(price))}
        </H4>
      </a>
    </Link>
  );
};

export default ProductCard2;
