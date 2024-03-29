import Card from "@component/Card";
import Carousel from "@component/carousel/Carousel";
import useWindowSize from "@hook/useWindowSize";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard6 from "../product-cards/ProductCard6";

export interface Section3Props {
  data: any []
}

const imageUrlMock = 'https://flora-express-images.s3.amazonaws.com/generic-shop/743425c0-1295-4062-b5c2-9d7e9faeec04'

const Section3: React.FC<Section3Props> = ({ data }: Section3Props) => {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const width = useWindowSize();

  useEffect(() => {
    if (width < 650) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <CategorySectionCreator
      iconName="categories"
      title="Top Categorias"
      seeMoreLink="#"
    >
      <Carousel totalSlides={5} visibleSlides={visibleSlides}>
        {data?.map((item, ind) => (
          <Link href={imageUrlMock} key={ind}>
            <a>
              <Card p="1rem">
                <ProductCard6
                  title={item.c_name}
                  subtitle={`${parseInt(item.salesQuantity)} vendidos esta semana`}
                  imgUrl={item?.c_images}
                />
              </Card>
            </a>
          </Link>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

export default Section3;
