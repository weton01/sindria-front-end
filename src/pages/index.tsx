import Box from "@component/Box";
import Section13 from "@component/home-1/Section13";
import Section14 from "@component/home-4/Section1";
import Section1 from "../components/home-1/Section1";
import Section10 from "../components/home-1/Section10";
import Section12 from "../components/home-1/Section12";
import Section2 from "../components/home-1/Section2";
import Section3 from "../components/home-1/Section3";
import Section4 from "../components/home-1/Section4";
import Section5 from "../components/home-1/Section5";
import AppLayout from "../components/layout/AppLayout";
import Section15 from "@component/home-4/Section2";
import Container from "../components/Container";

import { GetServerSideProps } from "next";
import { getProduct, getProductSuperStore } from "services/product";

const IndexPage = ({
  section2,
  section3,
  section4,
  section5,
  section13,
  section10
}) => {

  return (
    <main>
      <Section1 />
      <Section2 data={section2} />
      <Section3 data={section3} />
      <Section4 data={section4} />
      <Section5 data={section5} />
      <Container my="2rem">
        <Section14 />
        <Box mb="3.75rem">
          <Section15 />
        </Box>
      </Container>
      <Section10 data={section10} />
      <Section13 data={section13} />
      <Section12 />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [section5, rest] = await Promise.all([
    getProduct({
      params: {
        skip: 0,
        take: 6,
        orderBy: `created_at=DESC`,
        select: `name,netAmount,grossAmount,id,images`,
      },
    }),
    getProductSuperStore(),
  ]);

  return {
    props: {
      section2: rest.bestSalers,
      section3: rest.bestCategories,
      section5,
      section13: rest.rdmProducts,
      section10: rest.rdmCategories,
      section4: {
        reviews: rest.bestReviews,
        brands: rest.bestBrands
      },
    },
  };
};

IndexPage.layout = AppLayout;

export default IndexPage;
