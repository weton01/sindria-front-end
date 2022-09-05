import Box from "@component/Box";
import CarouselCard1 from "@component/carousel-cards/CarouselCard1";
import Carousel from "@component/carousel/Carousel";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";
import React, { Fragment } from "react";

const Section1: React.FC = () => {
  return (
    <Fragment>
      <Navbar navListOpen={true} />
      <Box bg="gray.white" mb="3.75rem">
        <Container pb="2rem">
          <Carousel
            totalSlides={5}
            visibleSlides={1}
            infinite={true}
            autoPlay={true}
            showDots={true}
            showArrow={false}
            spacing="0px"
          >
            <CarouselCard1 imgUrl="/assets/images/banners/img-for-carousel.webp"/>
            <CarouselCard1 imgUrl="/assets/images/banners/img-for-carousel2.webp"/>
            <CarouselCard1 imgUrl="/assets/images/banners/img-for-carousel3.webp"/>
            <CarouselCard1 imgUrl="/assets/images/banners/img-for-carousel4.webp"/>
            <CarouselCard1 imgUrl="/assets/images/banners/img-for-carousel5.webp"/>
          </Carousel>
        </Container>
      </Box>
    </Fragment>
  );
};

export default Section1;
