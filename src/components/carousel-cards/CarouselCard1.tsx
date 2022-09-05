import LazyImage from "@component/LazyImage";
import React from "react";
import Button from "../buttons/Button";
import Typography from "../Typography";
import { StyledCarouselCard1 } from "./CarouselCardStyle";

export interface CarouselCard1Props {
  imgUrl?: string
}

const CarouselCard1: React.FC<CarouselCard1Props> = ({ imgUrl }) => {
  return (
    <StyledCarouselCard1>
      <LazyImage
        width={1224}
        height={300}
        src={imgUrl}
      />
    </StyledCarouselCard1>
  );
};

export default CarouselCard1;
