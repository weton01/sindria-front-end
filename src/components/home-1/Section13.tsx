import Box from "@component/Box";
import Card from "@component/Card";
import Carousel from "@component/carousel/Carousel";
import FlexBox from "@component/FlexBox";
import HoverBox from "@component/HoverBox";
import LazyImage from "@component/LazyImage";
import { H4 } from "@component/Typography";
import productDatabase from "@data/product-database";
import useWindowSize from "@hook/useWindowSize";
import { formatCurrency } from "@utils/formatCurrency";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CategorySectionCreator from "../CategorySectionCreator";

const Section13: React.FC = () => {
  const [visibleSlides, setVisibleSlides] = useState(6);
  const width = useWindowSize();

  useEffect(() => {
    if (width < 370) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(4);
    else setVisibleSlides(6);
  }, [width]);

  return (
    <CategorySectionCreator
      iconName="gift"
      title="Grandes descontos"
      seeMoreLink="#"
    >
      <Box my="-0.25rem">
        <Carousel totalSlides={9} visibleSlides={visibleSlides}>
          {productDatabase.slice(60, 69).map((item, ind) => (
            <Box py="0.25rem" key={item.id}>
              <Card p="1rem">
                <Link href={`/product/${ind + 20}`}>
                  <a>
                    <HoverBox borderRadius={8} mb="0.5rem">
                      <LazyImage
                        src={item.imgUrl}
                        width="100%"
                        height="100%"
                        layout="responsive"
                        alt={item.title}
                      />
                    </HoverBox>
                    <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
                      {item.title}
                    </H4>

                    <FlexBox>
                      <H4
                        fontWeight="600"
                        fontSize="14px"
                        color="primary.main"
                        mr="0.5rem"
                      >
                         {formatCurrency(Math.ceil(item.price))}
                      </H4>

                      <H4 fontWeight="600" fontSize="14px" color="text.muted">
                        <del>{formatCurrency(Math.ceil(item.price))}</del>
                      </H4>
                    </FlexBox>
                  </a>
                </Link>
              </Card>
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};

export default Section13;
