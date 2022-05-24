import Box from "@component/Box";
import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard1 from "../product-cards/ProductCard1";

export interface Section2Props {
  data: any []
}

const Section2: React.FC<Section2Props> = ({ data }: Section2Props) => {
  const [visibleSlides, setVisibleSlides] = useState(4);
  const width = useWindowSize();

  useEffect(() => {
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  return (
    <CategorySectionCreator
      iconName="light"
      title="Mais Vendidos"
      seeMoreLink="#"
    >
      <Box mt="-0.25rem" mb="-0.25rem">
        <Carousel totalSlides={10} visibleSlides={visibleSlides}>
          {data?.map((item, ind) => (
            <Box py="0.25rem" key={ind}>
              <ProductCard1
                id={item.p_id}
                imgUrl={item.p_images.split(',')[0]}
                title={item.p_name}
                rating={4}
                price={item.p_grossAmount}
                off={item.p_netAmount}
                key={ind}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};
 
export default Section2;
